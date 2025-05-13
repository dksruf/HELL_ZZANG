/**
 * MacrosCard 컴포넌트
 *
 * 메인 화면에서 단백질, 탄수화물, 지방의 목표/섭취량을 시각적으로 보여주는 카드 컴포넌트입니다.
 * - 각 영양소별 MacroProgress(원형 그래프)로 표시
 * - consumedMacros(오늘 섭취량)를 Macro의 current로 반영
 *
 * Props:
 * - macros: Macro[] (목표값)
 * - consumedMacros: { protein, carbs, fat } (오늘 섭취량)
 */

import React from 'react';
import { View } from 'react-native';
import { MacroProgress } from './MacroProgress';
import { Macro } from '../models/Macro';
import { styles as globalStyles } from '../styles/index';

interface MacrosCardProps {
  macros: Macro[];
  consumedMacros: { protein: number; carbs: number; fat: number };
}

export const MacrosCard: React.FC<MacrosCardProps> = ({ macros, consumedMacros }) => {
  // 오늘 섭취량을 Macro의 current에 반영
  const macrosWithCurrent = macros.map((macro) => {
    let current = 0;
    if (macro.name === 'Protein') current = Math.round(consumedMacros.protein);
    else if (macro.name === 'Carbs') current = Math.round(consumedMacros.carbs);
    else if (macro.name === 'Fat') current = Math.round(consumedMacros.fat);
    
    // 기존 macro의 total 값을 유지하면서 새로운 Macro 객체 생성
    return new Macro(
      macro.name,
      current,
      macro.total,  // 기존 total 값 사용
      macro.unit,
      macro.color
    );
  });

  return (
    <View style={globalStyles.macrosCard}>
      <View style={globalStyles.macrosContainer}>
        {macrosWithCurrent.map((macro, index) => (
          <View key={index} style={{ alignItems: 'center', flex: 1 }}>
            <MacroProgress key={index} macro={macro} />
          </View>
        ))}
      </View>
    </View>
  );
}; 