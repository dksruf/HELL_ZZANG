from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.applications.inception_v3 import InceptionV3, preprocess_input, decode_predictions
import tensorflow as tf
import numpy as np
from PIL import Image
import pandas as pd
import io
from fastapi.responses import HTMLResponse
import os


app = FastAPI()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # project 디렉토리 기준
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

#모델 선언언
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

outputs = tf.keras.layers.Dense(101, activation='softmax')(x)
#outputs = tf.keras.layers.Dense(107, activation='softmax')(x)

model = tf.keras.Model(inputs, outputs)


#모델 불러오기
model.load_weights("cp.ckpt.weights.h5")













# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CSV 파일 로드
food_df = pd.read_csv("food_info.csv")  # CSV 파일에 음식, 칼로리, 영양성분 정보가 있어야 함
food_li = pd.read_csv("food_list.csv")
# InceptionV3 모델 로드
# model = InceptionV3(weights="imagenet")

# 음식 예측 함수
def classify_food(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).resize((224, 224))  # MobileNetV2 크기
    img_array = np.array(img) / 255.0  # 정규화
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)
    predicted_class = np.argmax(predictions)  # 가장 확률이 높은 클래스 선택
    confidence = np.max(predictions)  # 해당 클래스의 확률 값
    print("mmmmmmmmmmmmm ",predicted_class)
    # food_df에서 food_name과 클래스 인덱스를 매핑하는 컬럼이 필요
    # if "class_index" in food_df.columns:
    #     food_name = food_df.loc[food_df["class_index"] == predicted_class, "food_name"].values
    #     if len(food_name) > 0:
    #         return food_name[0], confidence
    
    try:
        food_name = food_li.iloc[predicted_class, 0]  # 첫 번째 컬럼(음식 이름) 선택
        print("mmmmmmmmmmmmm ",food_name)

    except IndexError:
        food_name = "Unknown"

    return food_name, confidence # 매칭되는 음식이 없을 경우

# CSV에서 음식 정보 조회
def get_food_info(food_name: str):
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

# 기본 상태 체크 및 HTML 연결
@app.get("/", response_class=HTMLResponse)
def read_root():
    
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    with open(index_path, "r", encoding="utf-8") as file:
        return file.read()

# 파비콘 요청 무시
@app.get("/favicon.ico")
def get_favicon():
    return {"message": "No favicon"}

# 정적 파일 서빙 (JavaScript, CSS 포함)
@app.get("/script.js", response_class=HTMLResponse)
def get_script():
    script_path = os.path.join(FRONTEND_DIR, "script.js")
    print(f"Looking for script at: {script_path}")
    if os.path.exists(script_path):
        with open(script_path, "r", encoding="utf-8") as file:
            return file.read()
    return {"error": "script.js not found"}

# 이미지 분석 API
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    print(f"Looking for script at: ")
    image_bytes = await file.read()
    food_name, confidence = classify_food(image_bytes)

    food_info = get_food_info(food_name)
    
    if food_info:
        return {
            "food": food_name,
            "confidence": float(confidence),
            **food_info
        }
    else:
        return {"food": food_name, "confidence": float(confidence), "message": "영양 정보 없음"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
