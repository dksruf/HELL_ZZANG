import React, { useState } from 'react';
import { View, Button, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const FoodAnalysis = () => {
  const [foodData, setFoodData] = useState<{
    food: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  } | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setError('카메라 권한이 필요합니다.');
      return false;
    }
    return true;
  };

  const takePicture = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        analyzeFood(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      setError('사진 촬영 중 오류가 발생했습니다.');
    }
  };

  const analyzeFood = async (uri: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: 'image/jpeg',
        name: 'food_image.jpg',
      } as any);

      const response = await fetch('http://192.168.0.100:8000/predict/', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }
      
      const data = await response.json();
      setFoodData(data);
    } catch (error) {
      console.error('Error analyzing food:', error);
      setError('음식 분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="음식 사진 촬영" onPress={takePicture} />
      
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}
      
      {foodData && (
        <View style={styles.resultContainer}>
          <Text style={styles.foodName}>{foodData.food}</Text>
          <Text style={styles.calories}>칼로리: {foodData.calories} kcal</Text>
          {foodData.protein && <Text>단백질: {foodData.protein}g</Text>}
          {foodData.carbs && <Text>탄수화물: {foodData.carbs}g</Text>}
          {foodData.fats && <Text>지방: {foodData.fats}g</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  imageContainer: {
    marginVertical: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: 300,
    height: 300,
  },
  resultContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginTop: 10,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calories: {
    fontSize: 16,
    marginBottom: 10,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
});

export default FoodAnalysis; 