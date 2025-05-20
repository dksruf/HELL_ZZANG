/**
 * AddMealModal 컴포넌트
 * 
 * 음식을 추가하는 모든 기능을 통합한 모달 컴포넌트입니다.
 * 
 * 주요 기능:
 * 1. 카메라로 사진 촬영
 * 2. 갤러리에서 사진 선택
 * 3. 직접 음식 정보 입력
 * 4. 저장된 음식 목록 보기
 * 
 * Props:
 * - visible: 모달 표시 여부
 * - onClose: 모달 닫기 함수
 * - onSave: 음식 저장 함수
 * - savedFoods: 저장된 음식 목록
 * - onDeleteSavedFood: 저장된 음식 삭제 함수
 * - onSaveFood: 저장된 음식 추가 함수
 */

import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, ScrollView, TextInput, Image, StyleSheet, Alert } from 'react-native';
import { ThemedText } from './ThemedText';
import { styles as globalStyles } from '../styles/index';
import { Meal } from '../models/Meal';
import * as ImagePicker from 'expo-image-picker';
import { apiService } from '../services/api';
import { LoadingOverlay } from './LoadingOverlay';
import { FixResultsModal } from './FixResultsModal';

interface AddMealModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (meal: Meal) => void;
  savedFoods: Meal[];
  onDeleteSavedFood: (index: number) => void;
  onSaveFood: (meal: Meal) => void;
}

const localStyles = StyleSheet.create({
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
});

export const AddMealModal: React.FC<AddMealModalProps> = ({
  visible,
  onClose,
  onSave,
  savedFoods,
  onDeleteSavedFood,
  onSaveFood,
}) => {
  const [currentView, setCurrentView] = useState<'options' | 'describe' | 'saved'>('options');
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodProtein, setFoodProtein] = useState('');
  const [foodCarbs, setFoodCarbs] = useState('');
  const [foodFat, setFoodFat] = useState('');
  const [foodGrams, setFoodGrams] = useState('');
  const [currentImageUri, setCurrentImageUri] = useState<string | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showFixModal, setShowFixModal] = useState(false);
  const [editingFood, setEditingFood] = useState({
    name: '',
    koreanName: '',
    quantity: 100,
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });

  const handleCameraPress = async () => {
    try {
      // 카메라 권한 요청
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다.');
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
        setCurrentImageUri(result.assets[0].uri);
        await analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('카메라 오류:', error);
      Alert.alert('오류', '카메라 실행 중 오류가 발생했습니다.');
    }
  };

  const handleGalleryPress = async () => {
    try {
      // 갤러리 권한 요청
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
        return;
      }

      // 갤러리 실행
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      
      if (!result.canceled) {
        setCurrentImageUri(result.assets[0].uri);
        await analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('갤러리 오류:', error);
      Alert.alert('오류', '갤러리 접근 중 오류가 발생했습니다.');
    }
  };

  const analyzeImage = async (imageUri: string) => {
    console.log('이미지 분석 시작:', imageUri);
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      console.log('API 호출 시작');
      const result = await apiService.analyzeFoodImage(imageUri);
      console.log('API 응답 받음:', result);
      
      // 분석 결과로 editingFood 상태 업데이트
      const analyzedFood = {
        name: result.food || '음식',
        koreanName: result.food_korean,
        quantity: 100,
        calories: result.calories || 0,
        protein: result.protein || 0,
        carbs: result.carbs || 0,
        fats: result.fats || 0
      };
      
      console.log('분석된 음식 정보:', analyzedFood);
      setEditingFood(analyzedFood);
      
      // 메인 모달을 숨기고 분석 결과 모달을 표시
      setShowFixModal(true);
      console.log('FixResultsModal 표시됨');
    } catch (error) {
      console.error('이미지 분석 오류:', error);
      setAnalysisError('이미지 분석 중 오류가 발생했습니다.');
      Alert.alert('분석 실패', '이미지 분석 중 오류가 발생했습니다. 직접 입력해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFixSave = () => {
    // 분석 결과를 입력 폼에 반영
    setFoodName(editingFood.name);
    setFoodCalories(editingFood.calories.toString());
    setFoodProtein(editingFood.protein.toString());
    setFoodCarbs(editingFood.carbs.toString());
    setFoodFat(editingFood.fats.toString());
    setFoodGrams(editingFood.quantity.toString());
    
    // 분석 결과 모달을 닫고 입력 폼으로 전환
    setShowFixModal(false);
    setCurrentView('describe');
  };

  const handleDescribePress = () => {
    setCurrentView('describe');
  };

  const handleSavedFoodsPress = () => {
    setCurrentView('saved');
  };

  const handleBack = () => {
    setCurrentView('options');
    setFoodName('');
    setFoodCalories('');
    setFoodProtein('');
    setFoodCarbs('');
    setFoodFat('');
    setFoodGrams('');
    setCurrentImageUri(undefined);
  };

  const handleSave = () => {
    if (!foodName || !foodCalories || !foodProtein || !foodCarbs || !foodFat || !foodGrams) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const meal = Meal.fromFormData(
      foodName,
      editingFood.koreanName || foodName,
      parseInt(foodCalories),
      parseInt(foodProtein),
      parseInt(foodCarbs),
      parseInt(foodFat),
      parseInt(foodGrams),
      currentImageUri
    );

    onSave(meal);
    onSaveFood(meal);
    handleBack();
  };

  const renderOptionsView = () => (
    <View style={globalStyles.optionModalContainer}>
      <TouchableOpacity style={globalStyles.optionCard} onPress={handleDescribePress}>
        <View style={globalStyles.optionIconContainer}>
          <ThemedText style={globalStyles.optionIcon}>✏️</ThemedText>
        </View>
        <View style={globalStyles.optionTextContainer}>
          <ThemedText style={globalStyles.optionTitle}>직접 입력</ThemedText>
          <ThemedText style={globalStyles.optionDesc}>직접 음식정보를 입력합니다</ThemedText>
        </View>
      </TouchableOpacity>
      <View style={globalStyles.optionDivider} />
      <TouchableOpacity style={globalStyles.optionCard} onPress={handleSavedFoodsPress}>
        <View style={globalStyles.optionIconContainer}>
          <ThemedText style={globalStyles.optionIcon}>📋</ThemedText>
        </View>
        <View style={globalStyles.optionTextContainer}>
          <ThemedText style={globalStyles.optionTitle}>저장된 음식</ThemedText>
          <ThemedText style={globalStyles.optionDesc}>이전에 추가한 음식 목록</ThemedText>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderDescribeView = () => (
    <ScrollView style={globalStyles.describeFoodContent}>
      <View style={globalStyles.inputContainer}>
        <ThemedText style={globalStyles.inputLabel}>음식 이름</ThemedText>
        <TextInput
          style={globalStyles.largeInput}
          placeholder="예: 치킨 샐러드"
          placeholderTextColor="#999"
          value={foodName}
          onChangeText={setFoodName}
        />
      </View>
      
      <View style={globalStyles.inputContainer}>
        <ThemedText style={globalStyles.inputLabel}>칼로리 (kcal)</ThemedText>
        <TextInput
          style={globalStyles.largeInput}
          placeholder="예: 350"
          keyboardType="numeric"
          placeholderTextColor="#999"
          value={foodCalories}
          onChangeText={setFoodCalories}
        />
      </View>
      
      <View style={globalStyles.inputContainer}>
        <ThemedText style={globalStyles.inputLabel}>영양소 정보</ThemedText>
        <View style={globalStyles.macroInputWrapper}>
          <View style={globalStyles.macroInputItem}>
            <ThemedText style={globalStyles.macroInputLabel}>
              <ThemedText style={globalStyles.macroIcon}>🥩 </ThemedText>
              단백질 (g)
            </ThemedText>
            <TextInput
              style={globalStyles.largeInput}
              placeholder="25"
              keyboardType="numeric"
              placeholderTextColor="#999"
              value={foodProtein}
              onChangeText={setFoodProtein}
            />
          </View>
          <View style={globalStyles.macroInputItem}>
            <ThemedText style={globalStyles.macroInputLabel}>
              <ThemedText style={globalStyles.macroIcon}>🌾 </ThemedText>
              탄수화물 (g)
            </ThemedText>
            <TextInput
              style={globalStyles.largeInput}
              placeholder="30"
              keyboardType="numeric"
              placeholderTextColor="#999"
              value={foodCarbs}
              onChangeText={setFoodCarbs}
            />
          </View>
          <View style={globalStyles.macroInputItem}>
            <ThemedText style={globalStyles.macroInputLabel}>
              <ThemedText style={globalStyles.macroIcon}>🥑 </ThemedText>
              지방 (g)
            </ThemedText>
            <TextInput
              style={globalStyles.largeInput}
              placeholder="10"
              keyboardType="numeric"
              placeholderTextColor="#999"
              value={foodFat}
              onChangeText={setFoodFat}
            />
          </View>
        </View>
      </View>

      <View style={globalStyles.inputContainer}>
        <ThemedText style={globalStyles.inputLabel}>섭취량 (g)</ThemedText>
        <TextInput
          style={globalStyles.largeInput}
          placeholder="예: 150"
          keyboardType="numeric"
          placeholderTextColor="#999"
          value={foodGrams}
          onChangeText={setFoodGrams}
        />
      </View>
    </ScrollView>
  );

  const renderSavedFoodsView = () => (
    <ScrollView style={globalStyles.savedFoodsList} contentContainerStyle={globalStyles.savedFoodsListContent}>
      {savedFoods.length > 0 ? (
        savedFoods.map((meal, index) => (
          <View key={index} style={globalStyles.savedFoodItemContainer}>
            <TouchableOpacity 
              style={globalStyles.mealCard}
              onPress={() => {
                onSave(meal);
                onClose();
              }}
            >
              <View style={globalStyles.mealInfo}>
                {meal.imageUri && (
                  <Image
                    source={{ uri: meal.imageUri }}
                    style={localStyles.mealImage}
                  />
                )}
                <View>
                  <View style={globalStyles.mealNameContainer}>
                    <ThemedText style={globalStyles.mealName}>{meal.name}</ThemedText>
                    <ThemedText style={globalStyles.mealGrams}>{meal.grams}g</ThemedText>
                    <ThemedText style={globalStyles.mealCalories}>{meal.calories}kcal</ThemedText>
                  </View>
                  <View style={globalStyles.macroTags}>
                    <ThemedText style={globalStyles.macroTag}>🥩 {meal.protein}g</ThemedText>
                    <ThemedText style={globalStyles.macroTag}>🌾 {meal.carbs}g</ThemedText>
                    <ThemedText style={globalStyles.macroTag}>🥑 {meal.fat}g</ThemedText>
                  </View>
                </View>
              </View>
              <View style={globalStyles.mealRightSection}>
                <View style={globalStyles.calorieDeleteContainer}>
                  <TouchableOpacity 
                    style={globalStyles.deleteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      onDeleteSavedFood(index);
                    }}
                  >
                    <ThemedText style={globalStyles.deleteButtonText}>✕</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={globalStyles.emptyListContainer}>
          <ThemedText style={globalStyles.emptyListIcon}>🍽️</ThemedText>
          <ThemedText style={globalStyles.emptyListText}>저장된 음식이 없습니다.</ThemedText>
          <ThemedText style={globalStyles.emptyListSubText}>식사를 추가하면 자동으로 저장됩니다.</ThemedText>
        </View>
      )}
    </ScrollView>
  );

  return (
    <>
      <Modal
        visible={visible && !showFixModal}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={globalStyles.modalContent}>
            <View style={globalStyles.modalHeader}>
              <ThemedText style={globalStyles.modalTitle}>
                {currentView === 'options' ? '식사 추가' :
                 currentView === 'describe' ? '음식 정보 입력' :
                 '저장된 음식'}
              </ThemedText>
              {currentView !== 'options' ? (
                <TouchableOpacity 
                  style={globalStyles.closeButtonContainer}
                  onPress={handleBack}
                >
                  <ThemedText style={globalStyles.closeButton}>←</ThemedText>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={globalStyles.closeButtonContainer}
                  onPress={onClose}
                >
                  <ThemedText style={globalStyles.closeButton}>✕</ThemedText>
                </TouchableOpacity>
              )}
            </View>
            
            {currentView === 'options' && renderOptionsView()}
            {currentView === 'describe' && renderDescribeView()}
            {currentView === 'saved' && renderSavedFoodsView()}

            {currentView === 'describe' && (
              <View style={globalStyles.modalFooter}>
                <TouchableOpacity 
                  style={[globalStyles.footerButton, globalStyles.cancelButton]} 
                  onPress={handleBack}
                >
                  <ThemedText style={globalStyles.buttonText}>취소</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[globalStyles.footerButton, globalStyles.saveButton]}
                  onPress={handleSave}
                >
                  <ThemedText style={globalStyles.buttonText}>저장</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <FixResultsModal
        visible={showFixModal}
        onClose={() => {
          setShowFixModal(false);
          setCurrentView('describe');
        }}
        onSave={handleFixSave}
        editingFood={editingFood}
        setEditingFood={setEditingFood}
        isEditingExistingMeal={false}
      />

      <LoadingOverlay visible={isAnalyzing} />
      
      {analysisError && (
        <View style={globalStyles.errorContainer}>
          <ThemedText style={globalStyles.errorText}>{analysisError}</ThemedText>
        </View>
      )}
    </>
  );
}; 