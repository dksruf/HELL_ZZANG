# train_model.py
from tensorflow.keras.applications.inception_v3 import InceptionV3
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from data_preprocessing import get_data_generators

# InceptionV3 모델 불러오기 (최상위 분류층 제외)
base_model = InceptionV3(weights="imagenet", include_top=False)

# 기존 층을 동결 (사전 훈련된 가중치를 유지)
for layer in base_model.layers:
    layer.trainable = False

# 새로운 출력층 추가
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(1024, activation="relu")(x)
predictions = Dense(10, activation="softmax")  # 클래스 개수 변경

# 새로운 모델 구성
model = Model(inputs=base_model.input, outputs=predictions)

# 데이터 로드
train_dir = "dataset/train"
val_dir = "dataset/val"
train_generator, val_generator = get_data_generators(train_dir, val_dir)

# 모델 컴파일
model.compile(optimizer=Adam(learning_rate=0.001), loss="categorical_crossentropy", metrics=["accuracy"])

# 새롭게 추가한 층만 학습
model.fit(train_generator, validation_data=val_generator, epochs=10)

# 특정 층부터 학습 가능하게 설정 (Fine-tuning)
for layer in base_model.layers[-30:]:  # 마지막 30개 층 학습 가능
    layer.trainable = True

# 파인튜닝을 위한 낮은 학습률 설정
model.compile(optimizer=Adam(learning_rate=0.0001), loss="categorical_crossentropy", metrics=["accuracy"])

# 파인튜닝 수행
model.fit(train_generator, validation_data=val_generator, epochs=10)

# 모델 저장
model.save("fine_tuned_inceptionv3.h5")
