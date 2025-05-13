/**
 * DescribeFoodModal 컴포넌트
 * 
 * 사용자가 직접 음식 정보를 입력할 수 있는 모달 컴포넌트입니다.
 * 
 * 주요 기능:
 * 1. 음식 이름 입력
 * 2. 칼로리 입력
 * 3. 영양소(단백질, 탄수화물, 지방) 입력
 * 4. 그램 수 입력
 * 5. 입력된 정보 저장
 * 
 * Props:
 * - visible: 모달 표시 여부
 * - onClose: 모달 닫기 함수
 * - onSave: 입력된 정보 저장 함수
 * - foodName: 음식 이름 상태
 * - setFoodName: 음식 이름 설정 함수
 * - foodCalories: 칼로리 상태
 * - setFoodCalories: 칼로리 설정 함수
 * - foodProtein: 단백질 상태
 * - setFoodProtein: 단백질 설정 함수
 * - foodCarbs: 탄수화물 상태
 * - setFoodCarbs: 탄수화물 설정 함수
 * - foodFat: 지방 상태
 * - setFoodFat: 지방 설정 함수
 * - foodGrams: 그램 수 상태
 * - setFoodGrams: 그램 수 설정 함수
 */

import React from 'react';
import { View, Modal, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { styles } from '../styles/index';

interface DescribeFoodModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  foodName: string;
  setFoodName: (name: string) => void;
  foodCalories: string;
  setFoodCalories: (calories: string) => void;
  foodProtein: string;
  setFoodProtein: (protein: string) => void;
  foodCarbs: string;
  setFoodCarbs: (carbs: string) => void;
  foodFat: string;
  setFoodFat: (fat: string) => void;
  foodGrams: string;
  setFoodGrams: (grams: string) => void;
}

export const DescribeFoodModal: React.FC<DescribeFoodModalProps> = ({
  visible,
  onClose,
  onSave,
  foodName,
  setFoodName,
  foodCalories,
  setFoodCalories,
  foodProtein,
  setFoodProtein,
  foodCarbs,
  setFoodCarbs,
  foodFat,
  setFoodFat,
  foodGrams,
  setFoodGrams,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>음식 추가</ThemedText>
            <TouchableOpacity 
              style={styles.closeButtonContainer}
              onPress={onClose}
            >
              <ThemedText style={styles.closeButton}>✕</ThemedText>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.describeFoodContent}>
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>음식 이름</ThemedText>
              <TextInput
                style={styles.largeInput}
                placeholder="예: 치킨 샐러드"
                placeholderTextColor="#999"
                value={foodName}
                onChangeText={setFoodName}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>100g 당 칼로리 (kcal)</ThemedText>
              <TextInput
                style={styles.largeInput}
                placeholder="예: 350"
                keyboardType="numeric"
                placeholderTextColor="#999"
                value={foodCalories}
                onChangeText={setFoodCalories}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>영양소 정보 (100g 당)</ThemedText>
              <View style={styles.macroInputWrapper}>
                <View style={styles.macroInputItem}>
                  <ThemedText style={styles.macroInputLabel}>
                    <ThemedText style={styles.macroIcon}>🥩 </ThemedText>
                    단백질 (g)
                  </ThemedText>
                  <TextInput
                    style={styles.largeInput}
                    placeholder="25"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                    value={foodProtein}
                    onChangeText={setFoodProtein}
                  />
                </View>
                <View style={styles.macroInputItem}>
                  <ThemedText style={styles.macroInputLabel}>
                    <ThemedText style={styles.macroIcon}>🌾 </ThemedText>
                    탄수화물 (g)
                  </ThemedText>
                  <TextInput
                    style={styles.largeInput}
                    placeholder="30"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                    value={foodCarbs}
                    onChangeText={setFoodCarbs}
                  />
                </View>
                <View style={styles.macroInputItem}>
                  <ThemedText style={styles.macroInputLabel}>
                    <ThemedText style={styles.macroIcon}>🥑 </ThemedText>
                    지방 (g)
                  </ThemedText>
                  <TextInput
                    style={styles.largeInput}
                    placeholder="10"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                    value={foodFat}
                    onChangeText={setFoodFat}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>1 회분(g)</ThemedText>
              <TextInput
                style={styles.largeInput}
                placeholder="예: 150"
                keyboardType="numeric"
                placeholderTextColor="#999"
                value={foodGrams}
                onChangeText={setFoodGrams}
              />
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.footerButton} 
              onPress={onClose}
            >
              <ThemedText style={styles.buttonText}>취소</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.footerButton}
              onPress={onSave}
            >
              <ThemedText style={styles.buttonText}>저장</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}; 