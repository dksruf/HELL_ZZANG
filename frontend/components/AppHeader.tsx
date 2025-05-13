/**
 * AppHeader 컴포넌트
 * 
 * 앱의 상단 헤더를 표시하는 컴포넌트입니다.
 * 
 * 주요 기능:
 * 1. 앱 타이틀 표시
 * 2. 설정 버튼 제공
 * 
 * Props:
 * - onSettingsPress: 설정 버튼 클릭 핸들러
 */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { styles as globalStyles } from '../styles/index';

interface AppHeaderProps {
  onSettingsPress: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onSettingsPress }) => {
  return (
    <View style={globalStyles.header}>
      <ThemedText style={globalStyles.appTitle}>HELLZANG</ThemedText>
      <TouchableOpacity 
        style={globalStyles.settingsButton}
        onPress={onSettingsPress}
      >
        <ThemedText style={globalStyles.settingsButtonText}>⚙️</ThemedText>
      </TouchableOpacity>
    </View>
  );
}; 