/**
 * FixResultsModal 컴포넌트
 * 
 * 음식 분석 결과를 수정할 수 있는 모달 컴포넌트입니다.
 * 
 * 주요 기능:
 * 1. 분석된 음식의 이름, 칼로리, 영양소 정보 수정
 * 2. 수정된 정보 저장
 * 3. 기존 식사 수정 시 해당 식사 정보 업데이트
 * 
 * Props:
 * - visible: 모달 표시 여부
 * - onClose: 모달 닫기 함수
 * - onSave: 수정된 정보 저장 함수
 * - editingFood: 수정할 음식 데이터
 * - setEditingFood: 음식 데이터 수정 함수
 * - isEditingExistingMeal: 기존 식사 수정 여부
 */

import React, { Dispatch, SetStateAction } from 'react';
import { View, Modal, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { styles } from '../styles/index';

interface AnalyzedFoodData {
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface FixResultsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  editingFood: AnalyzedFoodData;
  setEditingFood: Dispatch<SetStateAction<AnalyzedFoodData>>;
  isEditingExistingMeal: boolean;
}

export const FixResultsModal: React.FC<FixResultsModalProps> = ({
  visible,
  onClose,
  onSave,
  editingFood,
  setEditingFood,
  isEditingExistingMeal,
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
            <ThemedText style={styles.modalTitle}>분석 결과 수정</ThemedText>
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
                value={editingFood.name}
                onChangeText={(text) => setEditingFood({...editingFood, name: text})}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>칼로리 (kcal)</ThemedText>
              <TextInput
                style={styles.largeInput}
                placeholder="예: 350"
                keyboardType="numeric"
                placeholderTextColor="#999"
                value={editingFood.calories.toString()}
                onChangeText={(text) => setEditingFood({...editingFood, calories: Number(text) || 0})}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>영양소 정보</ThemedText>
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
                    value={editingFood.protein.toString()}
                    onChangeText={(text) => setEditingFood({...editingFood, protein: Number(text) || 0})}
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
                    value={editingFood.carbs.toString()}
                    onChangeText={(text) => setEditingFood({...editingFood, carbs: Number(text) || 0})}
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
                    value={editingFood.fats.toString()}
                    onChangeText={(text) => setEditingFood({...editingFood, fats: Number(text) || 0})}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[styles.footerButton, styles.cancelButton]} 
              onPress={onClose}
            >
              <ThemedText style={styles.buttonText}>취소</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.footerButton, styles.saveButton]}
              onPress={onSave}
            >
              <ThemedText style={styles.buttonText}>
                {isEditingExistingMeal ? '수정' : '저장'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}; 