from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow.keras.applications.inception_v3 import InceptionV3, preprocess_input, decode_predictions
import tensorflow as tf
import numpy as np
from PIL import Image
import pandas as pd
import io
from fastapi.responses import HTMLResponse
import os



# food_list.csv의 처음 101개 음식을 클래스 레이블로 사용
CLASS_LABELS = [
    "apple_pie", "baby_back_ribs", "baklava", "beef_carpaccio", "beef_tartare",
    "beet_salad", "beignets", "bibimbap", "boiled egg", "bread_pudding",
    "breakfast_burrito", "bruschetta", "caesar_salad", "cannoli", "caprese_salad",
    "carrot_cake", "ceviche", "cheese_plate", "cheesecake", "chicken breast",
    "chicken_curry", "chicken_quesadilla", "chicken_wings", "chocolate_cake",
    "chocolate_mousse", "churros", "clam_chowder", "club_sandwich", "crab_cakes",
    "creme_brulee", "croque_madame", "cup_cakes", "deviled_eggs", "donuts",
    "dumplings", "edamame", "eggs_benedict", "escargots", "falafel",
    "filet_mignon", "fish_and_chips", "foie_gras", "french_fries", "french_onion_soup",
    "french_toast", "fried egg", "fried_calamari", "fried_rice", "frozen_yogurt",
    "garlic_bread", "gnocchi", "greek_salad", "grilled_cheese_sandwich", "grilled_salmon",
    "guacamole", "gyoza", "hamburger", "hot_and_sour_soup", "hot_dog",
    "huevos_rancheros", "hummus", "ice_cream", "lasagna", "lobster_bisque",
    "lobster_roll_sandwich", "macaroni_and_cheese", "macarons", "miso_soup",
    "Multigrain rice", "mussels", "nachos", "omelette", "onion_rings",
    "oysters", "pad_thai", "paella", "pancakes", "panna_cotta", "peking_duck",
    "pho", "pizza", "pork", "pork_chop", "poutine", "prime_rib",
    "pulled_pork_sandwich", "ramen", "ravioli", "red_velvet_cake", "risotto",
    "samosa", "sashimi", "scallops", "seaweed_salad", "shrimp_and_grits",
    "spaghetti_bolognese", "spaghetti_carbonara", "spring_rolls", "steak",
    "strawberry_shortcake", "white rice"
]  # 총 101개



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
#model = InceptionV3(weights="imagenet") -> 원래코드

#==================모델선언=========================

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

#==================모델선언=========================


# 음식 예측 함수
def classify_food(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)
    predicted_class = np.argmax(predictions) -2  # 가장 높은 확률의 클래스 인덱스
    confidence = np.max(predictions)  # 해당 확률 값

    # CLASS_LABELS에서 직접 음식 이름 가져오기
    try:
        food_name = CLASS_LABELS[predicted_class]
    except IndexError:
        food_name = "Unknown"
        print(f"IndexError: Predicted class {predicted_class} out of range for {len(CLASS_LABELS)} classes")

    print(f"Predicted class: {predicted_class}, Food: {food_name}, Confidence: {confidence}")
    return food_name, confidence

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



#음식 리스트에서 고르는 곳
@app.get("/foods/")
async def get_food_list():
    # 음식 이름 목록 반환
    return {"foods": food_df["food_name"].tolist()}

@app.get("/food/{food_name}")
async def get_food_info_endpoint(food_name: str):
    food_data = get_food_info(food_name)
    if food_data:
        return {
            "food": food_name,
            **food_data  # calories, protein, carbs, fats 펼침
        }
    return {"message": f"{food_name}에 대한 정보가 없습니다."}




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
