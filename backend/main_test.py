import csv
from fastapi import FastAPI, File, UploadFile, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import pandas as pd
import io
from fastapi.responses import HTMLResponse
import os
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import json
from datetime import datetime

#==================================================================================================================#
class_names = ["아몬드","삶은계란", "닭가슴살", "계란후라이","잡곡밥", "돼지고기", "고구마","토마토","백미밥"] # -> 음식 인덱스. 아마도 이렇게

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # project 디렉토리 기준
FRONTEND_DIR = os.path.join(BASE_DIR, "HELLZANG")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CSV 파일 로드
food_df = pd.read_csv("food_df.csv")  # CSV 파일에 음식, 칼로리, 영양성분 정보가 있어야 함
f = open("food_index.csv", "r", encoding="utf-8")
reader = csv.reader(f)
food_index = list(reader)[0] # 음식 인덱스 정보
#food_df = pd.read_csv("food_info.csv")  # CSV 파일에 음식, 칼로리, 영양성분 정보가 있어야 함
#food_li = pd.read_csv("food_list.csv")

#==================================================================================================================#

#==================모델선언=========================#
#model = InceptionV3(weights="imagenet") -> 원래코드

def create_model ():
    """_summary_
    학습된 가중치를 불러오기 전, 가중치를 집어 넣을 모델을 선언\n
        예시 : new model = create_model()
    Returns:
        _type_: tf.keras.Model(inputs, outputs)\n
        케라스 mobilnet_v2 모델
    """
    pretrained_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet',
        pooling='avg'
    )

    pretrained_model.trainable = False

    inputs = pretrained_model.input

    x = tf.keras.layers.Dense(128, activation='relu')(pretrained_model.output)
    x = tf.keras.layers.Dense(128, activation='relu')(x)

    outputs = tf.keras.layers.Dense(len(food_index), activation='softmax')(x)  # 9개 클래스로 수정
    #outputs = tf.keras.layers.Dense(107, activation='softmax')(x)

    model = tf.keras.Model(inputs, outputs)

    model.compile(optimizer='adam',
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    return model
#==================모델선언=========================#


# 사전 학습된 MobileNet V2 모델 로드
checkpoint_path = "7_foods.weights.h5"

# `model_path`는 학습된 모델의 저장 경로입니다.
model_path = checkpoint_path  # 예시 경로

model = create_model()                  #모델 선언
model.load_weights(checkpoint_path)     #사전 학습한 가중치 불러오기

def preprocess_image(image_path):
    """
    이미지를 전처리하여 모델에 입력할 수 있는 형태로 변환합니다.
    """
    try:
        # BytesIO 객체인 경우 직접 처리
        if isinstance(image_path, io.BytesIO):
            image = Image.open(image_path)
        else:
            # 파일 경로인 경우
            image = Image.open(image_path)
        
        # 이미지가 올바르게 로드되었는지 확인
        if image is None:
            raise ValueError("이미지를 로드할 수 없습니다.")
            
        # RGB 모드로 변환 (알파 채널이 있는 경우 처리)
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        # 크기 조정
        image = image.resize((224, 224))
        
        # numpy 배열로 변환
        image = np.array(image)
        
        # MobileNet V2 전처리 적용
        image = preprocess_input(image)
        
        # 배치 차원 추가
        image = np.expand_dims(image, axis=0)
        
        return image
    except Exception as e:
        print(f"이미지 전처리 오류: {str(e)}")
        raise

def predict_food(image_path):
    """
    이미지 경로를 받아서 예측된 음식 이름을 반환합니다.
    """
    try:
        # 이미지 전처리
        processed_image = preprocess_image(image_path)
        
        # 예측 수행
        predictions = model.predict(processed_image)
        class_idx = np.argmax(predictions)      # 가장 높은 확률의 클래스 인덱스
        confidence = np.max(predictions)
        
        print(f"예측 클래스 인덱스: {class_idx}")
        print(f"예측 확률: {predictions}")
        
        return int(class_idx), confidence
    except Exception as e:
        print(f"예측 오류: {str(e)}")
        # 기본값 반환
        return 0, 0.0  # 첫 번째 클래스(삶은계란)를 기본값으로 반환


"""
# 예제 실행
if __name__ == "__main__":
    
    삶은계란 = "../images/boiled egg/다운로드 (17).jpg"
    닭가슴살 = "../images/chicken_breast/다운로드 (6).jpg"
    계란후라이 = "../images/fried egg/다운로드 (12).jpg"
    볶음밥 = "../images/fried_rice/49075.jpg"
    잡곡밥 = "../images/multigrain rice/16461_20712_1243.jpg"
    돼지고기 = "../images/pork/images - 2025-03-28T111141.519.jpg"
    백미밥 = "../images/white rice/다운로드 (4).jpg"
    
    image_path = 볶음밥  # 테스트 이미지 경로
    predicted_food = predict_food(image_path)-1
    print(predicted_food)
    print(f"예측된 음식: {class_names[predicted_food]}")
"""

#==================================================================================================================#

# CSV에서 음식 정보 조회
def get_food_info(food_name: str):
    """_summary_
    CSV 파일에서 음식의 정보를조회한다.\n
        음식의 정보를 csv 파일로 받아서 판다스데이터프레임으로 전환 후\n
        음식의 이름을 파라미터로 넣으면 그에 맞는 음식의 정보를 반환한다.\n
        관련된 메서드:\n
            없음\n
        관련된 데이터:\n
            food_df(pandas_dataframe)
    Args:
        food_name (str): str 타입의 데이터

    Returns:
        음식이 food_df 에 존재하면 그에 맞는 음식의 정보를 반환하고\n
        그렇지 않으면 아무것도 반환하지 않는다\n
        ex)\n
            return {\n
            "calories": float(row["calories"]),  # float으로 변환\n
            "protein": float(row["protein"]),\n
            "carbs": float(row["carbs"]),\n
            "fats": float(row["fats"])\n
        }\n
        end
    """
    food_row = food_df[food_df['food_name'].str.lower() == food_name.lower()]
    if not food_row.empty:
        row = food_row.iloc[0]
        return {
            "calories": float(row["calories"]),  # float으로 변환
            "protein": float(row["protein"]),
            "carbs": float(row["carbs"]),
            "fats": float(row["fats"])
        }
    return None

# 음식 예측 함수
def classify_food(image_bytes):
    """_summary_
    음식 이미지를 입력 받으면, 음식의 이름과 정확도를 반환한다.\n
    관련된 매서드:\n
        *predict_food(img)* -> img = io.BytesIO(image_bytes)\n
        *preprocess_image(image_path)* -> image_path = io.BytesIO(image_bytes)
    관련된 데이터:\n
            food_df(pandas_dataframe)
    Args:
        image_bytes (_type_): 프론트엔드에서 입력받은 이미지

    Returns:
        food_df 데이터 에서 예측한 정보의 index를 넣어서 음식이름을 받아와서.\n
        주어진 사진에 대해 모델이 예측 한 정보를 터미널에 출력하고, \n
        food_df 의 데이터를 바탕으로\n
        food_name(음식이름), confidence(정확도)\n
        를 출력한다.\n
        ex)\n
            food_name, confidence\n
        end
    """
    try:
        img = io.BytesIO(image_bytes)
        predicted_class, confidence = predict_food(img)

        # CLASS_LABELS에서 직접 음식 이름 가져오기
        try:
            food_name = food_index[predicted_class]
            name = food_index[predicted_class]
        except IndexError:
            food_name = "Unknown"
            name = "알 수 없음"
            print(f"IndexError: Predicted class {predicted_class} out of range for {len(food_index)} classes")

        print(f"Predicted class: {predicted_class}, Food: {food_name}, Name: {name}, Confidence: {confidence}")
        return food_name, name, confidence
    except Exception as e:
        print(f"분류 오류: {str(e)}")
        # 기본값 반환
        return "Unknown", "알 수 없음", 0.0

#==================================================================================================================#

# 이미지 분석 API
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        print(f"요청 받음: 파일명={file.filename}, 크기={file.size} bytes")
        print(f"요청 처리 시작: {file.filename}")
        print(f"Content-Type: {file.content_type}")  # 파일 타입 출력
        
        image_bytes = await file.read()
        print(f"이미지 데이터 크기: {len(image_bytes)} bytes")  # 이미지 데이터 크기 출력
        
        # 이미지 데이터가 비어있는지 확인
        if not image_bytes:
            print("이미지 데이터가 비어 있습니다.")
            return {"error": "이미지 데이터가 비어 있습니다."}
            
        food_name, name, confidence = classify_food(image_bytes)
        print(f"분류 결과: {food_name}({name}), 신뢰도: {confidence}")  # 분류 결과 출력

        food_info = get_food_info(food_name)
        print(f"음식 정보: {food_info}")  # 음식 정보 출력
        
        if food_info:
            return {
                "food": food_name,
                "name": name,
                "confidence": float(confidence),
                **food_info
            }
        else:
            return {
                "food": food_name,
                "name": name,
                "confidence": float(confidence),
                "message": "영양 정보 없음"
            }
    except Exception as e:
        print(f"예측 API 오류: {str(e)}")
        return {"error": f"이미지 처리 중 오류가 발생했습니다: {str(e)}"}

#음식 리스트에서 고르는 곳
@app.get("/foods/")
async def get_food_list():
    print("음식 목록 요청 받음")
    # 음식 이름 목록 반환
    return {"foods": food_df["food_name"].tolist()}

@app.get("/food/{food_name}")
async def get_food_info_endpoint(food_name: str):
    print(f"음식 정보 요청 받음: {food_name}")
    food_data = get_food_info(food_name)
    if food_data:
        return {
            "food": food_name,
            **food_data  # calories, protein, carbs, fats 펼침
        }
    return {"message": f"{food_name}에 대한 정보가 없습니다."}

# 테스트 엔드포인트 추가
@app.get("/test/")
async def test_endpoint():
    print("테스트 엔드포인트 호출됨")
    return {"message": "test"}
#==================================================================================================================#
#=========================================== 사용자 로그 저장 디렉토리 설정 ===========================================#
#==================================================================================================================#
USER_LOGS_DIR = './user_logs'

# 사용자별 로그 저장 API
@app.post('/user-logs/{user_name}')
async def save_user_log(user_name: str, data: dict = Body(...)):
    try:
        # 사용자 이름 유효성 검사
        if not user_name or user_name == 'undefined':
            raise HTTPException(
                status_code=400,
                detail="유효하지 않은 사용자 이름입니다. 로그인이 필요합니다."
            )

        # 사용자 디렉토리 생성
        user_dir = os.path.join(USER_LOGS_DIR, user_name)
        os.makedirs(user_dir, exist_ok=True)
        
        # 오늘 날짜로 파일명 생성
        today = datetime.now().strftime('%Y-%m-%d')
        file_path = os.path.join(user_dir, f'{today}.json')
        
        # imageUri 제외하고 데이터 복사
        meal_data = {k: v for k, v in data.items() if k != 'imageUri'}
        
        # 기존 데이터가 있으면 로드, 없으면 새로 생성
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
        else:
            # 첫 번째 식사 추가 시에만 목표값 저장
            existing_data = {
                'userName': user_name,
                'date': today,
                'meals': [],
                'goalCalories': data.get('goalCalories', 0),
                'goalProtein': data.get('goalProtein', 0),
                'goalCarbs': data.get('goalCarbs', 0),
                'goalFat': data.get('goalFat', 0),
                'totalCalories': 0,
                'totalProtein': 0,
                'totalCarbs': 0,
                'totalFat': 0
            }
        
        # 새 식사 데이터 추가 (imageUri와 goal 관련 필드 제외)
        meal_data = {k: v for k, v in meal_data.items() if not k.startswith('goal')}
        existing_data['meals'].append(meal_data)
        
        # 총 칼로리/영양소 업데이트
        existing_data['totalCalories'] += data.get('calories', 0)
        existing_data['totalProtein'] += data.get('protein', 0)
        existing_data['totalCarbs'] += data.get('carbs', 0)
        existing_data['totalFat'] += data.get('fat', 0)
        
        # 파일 저장
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(existing_data, f, ensure_ascii=False, indent=2)
        
        return {"message": "로그 저장 완료", "file": file_path}
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"로그 저장 중 오류가 발생했습니다: {str(e)}"
        )

# 사용자별 로그 조회 API
@app.get('/user-logs/{user_name}/{date}')
async def get_user_log(user_name: str, date: str):
    try:
        file_path = os.path.join(USER_LOGS_DIR, user_name, f'{date}.json')
        if not os.path.exists(file_path):
            return {"message": "해당 날짜의 기록이 없습니다."}
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 사용자별 전체 로그 조회 API
@app.get('/user-logs/{user_name}')
async def get_all_user_logs(user_name: str):
    try:
        user_dir = os.path.join(USER_LOGS_DIR, user_name)
        if not os.path.exists(user_dir):
            return {"message": "해당 사용자의 기록이 없습니다."}
        
        logs = []
        for file_name in os.listdir(user_dir):
            if file_name.endswith('.json'):
                with open(os.path.join(user_dir, file_name), 'r', encoding='utf-8') as f:
                    logs.append(json.load(f))
        
        return logs
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
#==================================================================================================================#
#=========================================== 사용자 로그 저장 디렉토리 설정 ===========================================#
#==================================================================================================================#
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8081)
