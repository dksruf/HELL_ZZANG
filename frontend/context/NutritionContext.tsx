import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Macro } from '../models/Macro';

interface NutritionInfo {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity?: number;
  imageUri?: string;
}

interface NutritionContextType {
  calories: number;
  setCalories: (calories: number) => void;
  foodName: string;
  setFoodName: (name: string) => void;
  macros: Macro[];
  setMacros: (macros: Macro[]) => void;
  nutritionInfo: NutritionInfo | null;
  setNutritionInfo: (info: NutritionInfo | null) => void;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const NutritionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [calories, setCalories] = useState<number>(0);
  const [foodName, setFoodName] = useState<string>('');
  const [macros, setMacros] = useState<Macro[]>([]);
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null);

  return (
    <NutritionContext.Provider
      value={{
        calories,
        setCalories,
        foodName,
        setFoodName,
        macros,
        setMacros,
        nutritionInfo,
        setNutritionInfo,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
}; 