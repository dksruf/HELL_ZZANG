from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.applications.inception_v3 import InceptionV3, preprocess_input, decode_predictions
import numpy as np
from PIL import Image
import pandas as pd
import io

app = FastAPI()

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

# InceptionV3 모델 로드
model = InceptionV3(weights="imagenet")

# 음식 예측 함수
def classify_food(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).resize((299, 299))
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    predictions = model.predict(img_array)
    decoded_predictions = decode_predictions(predictions, top=1)

    return decoded_predictions[0][0][1], float(decoded_predictions[0][0][2])

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

# 이미지 분석 API
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    food_name, confidence = classify_food(image_bytes)

    food_info = get_food_info(food_name)

    if food_info:
        return {
            "food": food_name,
            "confidence": confidence,
            **food_info
        }
    else:
        return {"food": food_name, "confidence": confidence, "message": "영양 정보 없음"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
