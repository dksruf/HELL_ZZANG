/**
 * CameraModal 컴포넌트
 * 
 * 카메라로 사진을 촬영하고 분석하는 기능을 담당하는 모달 컴포넌트입니다.
 * 
 * 주요 기능:
 * 1. 카메라로 사진 촬영
 * 2. 촬영한 사진 분석
 */

import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from './ThemedText';
import * as ImagePicker from 'expo-image-picker';
import { apiService } from '../services/api';
import { LoadingOverlay } from './LoadingOverlay';

interface CameraModalProps {
  visible: boolean;
  onClose: () => void;
  onImageAnalyzed: (imageUri: string, analyzedData: {
    name: string;
    koreanName?: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  visible,
  onClose,
  onImageAnalyzed,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (visible) {
      handleCameraPress();
    }
  }, [visible]);

  const handleCameraPress = async () => {
    try {
      // 카메라 권한 요청
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다.');
        onClose();
        return;
      }

      // 카메라 실행
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      
      if (!result.canceled) {
        await analyzeImage(result.assets[0].uri);
      } else {
        onClose();
      }
    } catch (error) {
      console.error('카메라 오류:', error);
      Alert.alert('오류', '카메라 실행 중 오류가 발생했습니다.');
      onClose();
    }
  };

  const analyzeImage = async (imageUri: string) => {
    setIsAnalyzing(true);
    try {
      const result = await apiService.analyzeFoodImage(imageUri);
      
      // 분석 결과를 부모 컴포넌트로 전달
      onImageAnalyzed(imageUri, {
        name: result.food || '음식',
        koreanName: result.food_korean,
        calories: result.calories || 0,
        protein: result.protein || 0,
        carbs: result.carbs || 0,
        fats: result.fats || 0,
      });
      
      onClose(); // 분석이 완료되면 모달 닫기
    } catch (error) {
      console.error('이미지 분석 오류:', error);
      Alert.alert('분석 실패', '이미지 분석 중 오류가 발생했습니다.');
      onClose();
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <LoadingOverlay visible={isAnalyzing} />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 