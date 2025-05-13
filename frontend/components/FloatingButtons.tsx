/**
 * FloatingButtons 컴포넌트
 * 
 * 메인 화면의 우측 하단에 표시되는 플로팅 버튼들을 포함하는 컴포넌트입니다.
 * 
 * 주요 기능:
 * 1. 서버 연결 테스트 버튼
 * 2. 식사 추가 버튼
 * 
 * Props:
 * - onTestPress: 서버 테스트 버튼 클릭 핸들러
 * - onAddPress: 식사 추가 버튼 클릭 핸들러
 */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { styles as globalStyles } from '../styles/index';

interface FloatingButtonsProps {
  onTestPress: () => void;
  onAddPress: () => void;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({
  onTestPress,
  onAddPress,
}) => {
  return (
    <View style={globalStyles.floatingButtonContainer}>
      <TouchableOpacity 
        style={[globalStyles.floatingButton, globalStyles.testButton]}
        onPress={onTestPress}
      >
        <ThemedText style={globalStyles.floatingButtonText}>🔍</ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[globalStyles.floatingButton, globalStyles.addButton]}
        onPress={onAddPress}
      >
        <ThemedText style={globalStyles.floatingButtonText}>+</ThemedText>
      </TouchableOpacity>
    </View>
  );
}; 