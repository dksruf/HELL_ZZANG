# data_preprocessing.py
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications.inception_v3 import preprocess_input

def get_data_generators(train_dir, val_dir, batch_size=32, target_size=(299, 299)):
    # 데이터 증강 및 전처리
    train_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True
    )

    val_datagen = ImageDataGenerator(preprocessing_function=preprocess_input)

    # 데이터 불러오기
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=target_size,  # InceptionV3 입력 크기
        batch_size=batch_size,
        class_mode="categorical"
    )

    val_generator = val_datagen.flow_from_directory(
        val_dir,
        target_size=target_size,
        batch_size=batch_size,
        class_mode="categorical"
    )

    return train_generator, val_generator
