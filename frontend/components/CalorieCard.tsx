/**
 * CalorieCard 컴포넌트
 *
 * 메인 화면에서 오늘의 칼로리 목표, 섭취량, 남은 칼로리를 원형 그래프와 텍스트로 시각화합니다.
 * - CircularProgress로 섭취 비율 표시
 * - consumedCalories, caloriesLeft, caloriePercentage를 텍스트로 표시
 *
 * Props:
 * - consumedCalories: number (오늘 섭취 칼로리)
 * - caloriesLeft: number (남은 칼로리)
 * - caloriePercentage: number (목표 대비 섭취 비율)
 */

import React, { useEffect } from 'react';
import { View } from 'react-native';
import { ThemedText } from './ThemedText';
import { CircularProgress } from './CircularProgress';
import { styles as globalStyles } from '../styles/index';

interface CalorieCardProps {
  consumedCalories: number;
  caloriesLeft: number;
  caloriePercentage: number;
}

export const CalorieCard: React.FC<CalorieCardProps> = ({
  consumedCalories,
  caloriesLeft,
  caloriePercentage,
}) => {
  const isValidNumber = (num: number) => !isNaN(num) && num !== null && num !== undefined;

  return (
    <View style={globalStyles.calorieCard}>
      <View style={globalStyles.calorieContentContainer}>
        <View style={globalStyles.calorieLeftInfo}>
        </View>

        <View style={globalStyles.circularProgressContainer}>
          <CircularProgress
            percentage={isValidNumber(caloriePercentage) ? caloriePercentage : 0}
            size={200}
            strokeWidth={15}
            color="#4CAF50"
          />
          <View style={globalStyles.calorieTextContainer}>
            <ThemedText style={globalStyles.calorieNumber}>
              {isValidNumber(consumedCalories) ? `${consumedCalories}kcal` : "0kcal"}
            </ThemedText>
            <ThemedText style={globalStyles.caloriesLeftText}>
              {isValidNumber(caloriesLeft)
                ? caloriesLeft >= 0
                  ? `${caloriesLeft}kcal 남음`
                  : `${Math.abs(caloriesLeft)}kcal 초과`
                : "2000kcal 남음"}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}; 