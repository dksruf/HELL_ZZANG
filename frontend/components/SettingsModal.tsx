import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { Macro } from '../models/Macro';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (settings: { totalCalories: number; macros: Macro[]; userName: string }) => void;
  currentValues: {
    totalCalories: number;
    macros: Macro[];
    userName: string;
  };
}

// 영양소별 칼로리 상수
const NUTRIENT_CALORIES = {
  CARBS: 4,    // 4kcal/g
  PROTEIN: 4,  // 4kcal/g
  FAT: 9,      // 9kcal/g
};

// 영양소 비율 상수
const NUTRIENT_RATIO = {
  CARBS: 5,    // 50%
  PROTEIN: 3,  // 30%
  FAT: 2,      // 20%
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  onSave,
  currentValues
}) => {
  const [totalCalories, setTotalCalories] = useState(currentValues.totalCalories);
  const [userName, setUserName] = useState(currentValues.userName);

  const calculateMacros = (calories: number) => {
    const totalRatio = NUTRIENT_RATIO.CARBS + NUTRIENT_RATIO.PROTEIN + NUTRIENT_RATIO.FAT;
    
    const carbsCalories = (calories * NUTRIENT_RATIO.CARBS) / totalRatio;
    const proteinCalories = (calories * NUTRIENT_RATIO.PROTEIN) / totalRatio;
    const fatCalories = (calories * NUTRIENT_RATIO.FAT) / totalRatio;

    const carbsGrams = Math.round(carbsCalories / NUTRIENT_CALORIES.CARBS);
    const proteinGrams = Math.round(proteinCalories / NUTRIENT_CALORIES.PROTEIN);
    const fatGrams = Math.round(fatCalories / NUTRIENT_CALORIES.FAT);

    return {
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams
    };
  };

  const handleSave = () => {
    if (!userName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    const calories = parseInt(totalCalories.toString());
    const macros = calculateMacros(calories);
    
    onSave({
      totalCalories: calories,
      macros: [
        new Macro('Protein', 0, macros.protein, 'g', '#FF6B6B'),
        new Macro('Carbs', 0, macros.carbs, 'g', '#FFB169'),
        new Macro('Fat', 0, macros.fat, 'g', '#4DABF7'),
      ],
      userName: userName.trim()
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>목표 설정</ThemedText>
          
          <View style={styles.inputContainer}>
            <ThemedText>이름</ThemedText>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="이름을 입력하세요"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText>목표 칼로리</ThemedText>
            <TextInput
              style={styles.input}
              value={totalCalories.toString()}
              onChangeText={(text) => setTotalCalories(Number(text) || 0)}
              keyboardType="numeric"
              placeholder="목표 칼로리 입력"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <ThemedText style={styles.buttonText}>취소</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <ThemedText style={styles.buttonText}>저장</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#ddd',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 