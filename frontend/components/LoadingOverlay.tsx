/**
 * LoadingOverlay 컴포넌트
 * 
 * 로딩 상태를 표시하는 오버레이 컴포넌트입니다.
 * 
 * 주요 기능:
 * 1. 로딩 스피너 표시
 * 2. 로딩 메시지 표시
 * 
 * Props:
 * - visible: 로딩 오버레이 표시 여부
 * - message: 로딩 메시지
 */

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { ThemedText } from './ThemedText';
import { styles as globalStyles } from '../styles/index';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = '이미지 분석 중...'
}) => {
  if (!visible) return null;

  return (
    <View style={globalStyles.loadingOverlay}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <ThemedText style={globalStyles.loadingText}>{message}</ThemedText>
    </View>
  );
}; 