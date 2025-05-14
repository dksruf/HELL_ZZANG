import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { CircularProgress } from './CircularProgress';
import { Macro } from '../models/Macro';

/**
 * MacroProgress 컴포넌트
 *
 * 단일 영양소(단백질/탄수화물/지방)의 목표 대비 섭취량을 원형 그래프와 텍스트로 시각화합니다.
 * - percentage: 섭취 비율(%)
 * - current/total: 현재/목표 섭취량
 * - 남은 양, 초과 여부, 색상 등 표시
 *
 * Props:
 * - macro: Macro (단일 영양소 정보)
 */

interface MacroProgressProps {
  macro: Macro;
}

export const MacroProgress: React.FC<MacroProgressProps> = ({ macro }) => {
  // 현재 값이 유효한지 확인
  const isValidNumber = (num: number) => !isNaN(num) && num !== null && num !== undefined;
  const current = isValidNumber(macro.current) ? macro.current : 0;
  const total = isValidNumber(macro.total) ? macro.total : 0;
  
  // 퍼센티지 계산
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  
  // 남은 양 계산
  const remaining = total - current;
  const isOverTarget = remaining < 0;
  
  // 표시할 텍스트 생성
  const displayCurrent = `${Math.round(current)}g`;
  const displayRemaining = `${Math.abs(Math.round(remaining))}g\n${isOverTarget ? '초과' : '남음'}`;

  // 색상 설정
  const progressColor = isOverTarget ? '#FF6B6B' : macro.color;

  return (
    <View style={styles.macroItem}>
      <View style={styles.macroCircleContainer}>
        <CircularProgress
          percentage={percentage}
          size={70}
          strokeWidth={8}
          color={progressColor}
        />
        <View style={styles.macroValueContainer}>
          <ThemedText style={styles.macroName}>{macro.name}</ThemedText>
          <ThemedText style={styles.macroCurrent}>{displayCurrent}</ThemedText>
        </View>
      </View>
      <ThemedText style={[
        styles.macroValue, 
        isOverTarget && styles.macroValueOver
      ]}>
        {displayRemaining}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  macroItem: {
    alignItems: 'center',
    width: '30%',
  },
  macroCircleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  macroValueContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  macroCurrent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  macroValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginTop: 4,
  },
  macroValueOver: {
    color: '#FF6B6B',
    fontWeight: '700',
  },
}); 