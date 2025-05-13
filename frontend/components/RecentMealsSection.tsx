/**
 * RecentMealsSection 컴포넌트
 * 
 * 메인 화면의 최근 추가된 식사 목록을 표시하는 섹션 컴포넌트입니다.
 * 
 * 주요 기능:
 * 1. 최근 추가된 식사 목록 표시
 * 2. 각 식사의 수정 및 삭제 기능 제공
 * 
 * Props:
 * - meals: 최근 식사 목록 (Meal 타입 배열)
 * - onDelete: 식사 삭제 핸들러
 * - onEdit: 식사 수정 핸들러
 */

import React from 'react';
import { View } from 'react-native';
import { ThemedText } from './ThemedText';
import { MealCard } from './MealCard';
import { Meal } from '../models/Meal';
import { styles as globalStyles } from '../styles/index';

interface RecentMealsSectionProps {
  meals: Meal[];
  onDelete: (index: number) => void;
  onEdit: (index: number) => void;
}

export const RecentMealsSection: React.FC<RecentMealsSectionProps> = ({
  meals,
  onDelete,
  onEdit,
}) => {
  return (
    <View style={globalStyles.recentSection}>
      <ThemedText style={globalStyles.sectionTitle}>Recently uploaded</ThemedText>
      {meals.map((meal, index) => (
        <MealCard
          key={`${meal.name}-${index}`}
          meal={meal}
          onDelete={() => onDelete(index)}
          onEdit={() => onEdit(index)}
        />
      ))}
    </View>
  );
}; 