/**
 * AddOptionsModal 컴포넌트
 * 
 * 음식을 추가하는 방법을 선택할 수 있는 모달 컴포넌트입니다.
 * 
 * 주요 기능:
 * 1. 카메라로 사진 촬영
 * 2. 갤러리에서 사진 선택
 * 3. 직접 음식 정보 입력
 * 
 * Props:
 * - visible: 모달 표시 여부
 * - onClose: 모달 닫기 함수
 * - onCameraPress: 카메라 버튼 클릭 핸들러
 * - onGalleryPress: 갤러리 버튼 클릭 핸들러
 * - onDescribePress: 직접 입력 버튼 클릭 핸들러
 * - onSavedFoodsPress: 저장된 음식 보기 버튼 클릭 핸들러
 */

import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { styles } from '../styles/index';

interface AddOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
  onDescribePress: () => void;
  onSavedFoodsPress: () => void;
}

export const AddOptionsModal: React.FC<AddOptionsModalProps> = ({
  visible,
  onClose,
  onCameraPress,
  onGalleryPress,
  onDescribePress,
  onSavedFoodsPress,
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
            <ThemedText style={styles.modalTitle}>식사 추가</ThemedText>
            <TouchableOpacity 
              style={styles.closeButtonContainer}
              onPress={onClose}
            >
              <ThemedText style={styles.closeButton}>✕</ThemedText>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalBody}>
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={onCameraPress}
            >
              <ThemedText style={styles.optionButtonText}>📸 카메라로 촬영</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={onGalleryPress}
            >
              <ThemedText style={styles.optionButtonText}>🖼️ 갤러리에서 선택</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={onDescribePress}
            >
              <ThemedText style={styles.optionButtonText}>✍️ 직접 입력</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionButton}
              onPress={onSavedFoodsPress}
            >
              <ThemedText style={styles.optionButtonText}>📋 저장된 음식</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}; 