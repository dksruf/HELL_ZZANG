/**
 * SavedFoodsModal 컴포넌트
 * 
 * 저장된 음식 목록을 보여주고 관리할 수 있는 모달 컴포넌트입니다.
 * 
 * 주요 기능:
 * 1. 저장된 음식 목록 표시
 * 2. 저장된 음식 삭제
 * 3. 저장된 음식 선택하여 추가
 * 4. 빈 목록 상태 처리
 * 
 * Props:
 * - visible: 모달 표시 여부
 * - onClose: 모달 닫기 함수
 * - onDelete: 음식 삭제 함수
 * - onEdit: 음식 선택하여 추가 함수
 * - savedFoods: 저장된 음식 목록
 */

import React from 'react';
import { View, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { styles } from '../styles/index';
import { MealCard } from './MealCard';
import { Meal } from '../models/Meal';

interface SavedFoodsModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: (index: number) => void;
  onEdit: (meal: Meal) => void;
  savedFoods: Meal[];
}

export const SavedFoodsModal: React.FC<SavedFoodsModalProps> = ({
  visible,
  onClose,
  onDelete,
  onEdit,
  savedFoods,
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
            <ThemedText style={styles.modalTitle}>저장된 음식</ThemedText>
            <TouchableOpacity 
              style={styles.closeButtonContainer}
              onPress={onClose}
            >
              <ThemedText style={styles.closeButton}>✕</ThemedText>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.savedFoodsList} contentContainerStyle={styles.savedFoodsListContent}>
            {savedFoods.length > 0 ? (
              savedFoods.map((meal, index) => (
                <View key={index} style={styles.savedFoodItemContainer}>
                  <MealCard
                    meal={meal}
                    onDelete={() => onDelete(index)}
                    onEdit={() => onEdit(meal)}
                  />
                </View>
              ))
            ) : (
              <View style={styles.emptyListContainer}>
                <ThemedText style={styles.emptyListIcon}>🍽️</ThemedText>
                <ThemedText style={styles.emptyListText}>저장된 음식이 없습니다.</ThemedText>
                <ThemedText style={styles.emptyListSubText}>식사를 추가하면 자동으로 저장됩니다.</ThemedText>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}; 