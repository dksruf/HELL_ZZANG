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
        <View style={[styles.modalContent, {
          maxHeight: '90%',
          width: '90%',
        }]}>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>음식 정보 수정</ThemedText>
              <TouchableOpacity 
                style={styles.closeButtonContainer}
                onPress={onClose}
              >
                <ThemedText style={styles.closeButton}>✕</ThemedText>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>음식 이름</ThemedText>
              <TextInput
                style={styles.input}
                value={foodName}
                onChangeText={setFoodName}
                placeholder="음식 이름을 입력하세요"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>칼로리 (kcal)</ThemedText>
              <TextInput
                style={styles.input}
                value={foodCalories}
                onChangeText={setFoodCalories}
                keyboardType="numeric"
                placeholder="칼로리를 입력하세요"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>단백질 (g)</ThemedText>
              <TextInput
                style={styles.input}
                value={foodProtein}
                onChangeText={setFoodProtein}
                keyboardType="numeric"
                placeholder="단백질을 입력하세요"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>탄수화물 (g)</ThemedText>
              <TextInput
                style={styles.input}
                value={foodCarbs}
                onChangeText={setFoodCarbs}
                keyboardType="numeric"
                placeholder="탄수화물을 입력하세요"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>지방 (g)</ThemedText>
              <TextInput
                style={styles.input}
                value={foodFat}
                onChangeText={setFoodFat}
                keyboardType="numeric"
                placeholder="지방을 입력하세요"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>그램 수 (g)</ThemedText>
              <TextInput
                style={styles.input}
                value={foodGrams}
                onChangeText={setFoodGrams}
                keyboardType="numeric"
                placeholder="그램 수를 입력하세요"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                <ThemedText style={styles.buttonText}>취소</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={onSave}>
                <ThemedText style={styles.buttonText}>저장</ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}; 