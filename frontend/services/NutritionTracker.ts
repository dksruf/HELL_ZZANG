import { Macro } from '../models/Macro';
import { Meal } from '../models/Meal';
import { Platform } from 'react-native';
import { storageService } from './StorageService';

/**
 * NutritionTracker 서비스
 *
 * 칼로리/영양성분 목표, 식사 기록, 저장 음식, 데이터 영속성(IndexedDB) 등을 관리하는 핵심 서비스 클래스입니다.
 *
 * 주요 기능:
 * - 목표 칼로리/영양성분 설정 및 저장
 * - 날짜별 식사 기록 추가/수정/삭제
 * - 저장된 음식 관리
 * - 오늘 섭취 칼로리/영양성분 계산
 * - 앱 첫 실행 시 기본값 자동 저장
 *
 * 데이터 구조:
 * - totalCalories: 목표 칼로리
 * - macros: Macro[] (목표 영양성분)
 * - meals: { [date: string]: Meal[] } (날짜별 식사)
 * - savedFoods: Meal[] (저장 음식)
 *
 * 주요 메서드:
 * - addMeal, updateMeal, deleteMeal, saveFood, deleteSavedFood
 * - updateSettings, getMacros, getCaloriesLeft, getConsumedMacros 등
 */

// 웹 환경에서 사용할 스토리지 타입 정의
declare global {
  interface Window {
    localStorage: Storage;
  }
}

export class NutritionTracker {
  private totalCalories: number;
  private macros: Macro[];
  private meals: { [date: string]: Meal[] } = {};
  private savedFoods: Meal[] = [];
  private isWeb: boolean;
  private isInitialized: boolean = false;

  constructor(totalCalories: number, macros: Macro[]) {
    this.totalCalories = totalCalories;
    this.macros = macros;
    this.isWeb = Platform.OS === 'web';
    this.init();
  }

  public async init() {
    if (this.isWeb) {
      try {
        await storageService.init();
        await this.loadFromStorage();
        this.isInitialized = true;
      } catch (error) {
        console.error('데이터 초기화 실패:', error);
      }
    }
  }

  private async loadFromStorage() {
    if (!this.isWeb || !this.isInitialized) return;

    try {
      // 설정 로드
      const settings = await storageService.getData('settings', 'current');
      if (settings) {
        this.totalCalories = settings.totalCalories;
        this.macros = settings.macros.map((m: any) => new Macro(
          m.name,
          m.current || 0,
          m.total !== undefined ? m.total : (m.target || 0),
          m.unit || 'g',
          m.color
        ));
      } else {
        // settings가 없으면(첫 실행) 현재 값을 저장해서 초기화
        await storageService.saveData('settings', {
          id: 'current',
          totalCalories: this.totalCalories,
          macros: this.macros
        });
      }

      // 식사 데이터 로드
      const meals = await storageService.getData('meals');
      if (meals) {
        this.meals = meals.reduce((acc, m) => {
          const date = m.date || this.getTodayString();
          if (!acc[date]) acc[date] = [];
          acc[date].push(this.createMealFromStoredData(m));
          return acc;
        }, {} as { [date: string]: Meal[] });
      }

      // 저장된 음식 로드
      const savedFoods = await storageService.getData('savedFoods');
      if (savedFoods) {
        this.savedFoods = savedFoods.map((f: any) => this.createMealFromStoredData(f));
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  }

  private async saveToStorage() {
    if (!this.isWeb || !this.isInitialized) return;

    try {
      // 설정 저장
      await storageService.saveData('settings', {
        id: 'current',
        totalCalories: this.totalCalories,
        macros: this.macros
      });

      // 식사 데이터 저장
      await storageService.clearStore('meals');
      for (const date in this.meals) {
        for (const meal of this.meals[date]) {
          await storageService.saveData('meals', {
            name: meal.name,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
            grams: meal.grams,
            imageUri: meal.imageUri,
            date: date
          });
        }
      }

      // 저장된 음식 저장
      await storageService.clearStore('savedFoods');
      for (const food of this.savedFoods) {
        await storageService.saveData('savedFoods', {
          name: food.name,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          grams: food.grams,
          imageUri: food.imageUri
        });
      }
    } catch (error) {
      console.error('데이터 저장 실패:', error);
    }
  }

  // 저장된 데이터에서 Meal 객체 생성
  private createMealFromStoredData(mealData: any): Meal {
    return new Meal(
      mealData.name,
      mealData.calories,
      mealData.protein,
      mealData.carbs,
      mealData.fat,
      mealData.grams,
      mealData.imageUri,
      mealData.date
    );
  }

  // 오늘 날짜 구하기
  private getTodayString() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  // 식사 추가
  async addMeal(meal: Meal) {
    const date = meal.date || this.getTodayString();
    if (!this.meals[date]) this.meals[date] = [];
    this.meals[date].push(meal);
    await this.saveToStorage();
  }

  async updateMeal(date: string, index: number, meal: Meal) {
    if (date in this.meals && index >= 0 && index < this.meals[date].length) {
      this.meals[date][index] = meal;
      await this.saveToStorage();
    }
  }

  async deleteMeal(date: string, index: number) {
    if (date in this.meals && index >= 0 && index < this.meals[date].length) {
      this.meals[date].splice(index, 1);
      await this.saveToStorage();
    }
  }

  async saveFood(food: Meal) {
    this.savedFoods.push(food);
    await this.saveToStorage();
  }

  async deleteSavedFood(index: number) {
    if (index >= 0 && index < this.savedFoods.length) {
      this.savedFoods.splice(index, 1);
      await this.saveToStorage();
    }
  }

  async updateSettings(totalCalories: number, macros: Macro[]) {
    this.totalCalories = totalCalories;
    this.macros = macros;
    await this.saveToStorage();
  }

  getMacros(): Macro[] {
    return [...this.macros];
  }

  getCaloriesLeft(): number {
    // totalCalories가 유효한 값인지 확인
    if (!this.totalCalories || isNaN(this.totalCalories) || this.totalCalories <= 0) {
      return 0;
    }

    // 실제 그램당 칼로리 계산
    const consumedCalories = this.getMeals().reduce(
      (total, meal) => total + meal.calculateActualCalories(),
      0
    );
    return Math.max(0, this.totalCalories - consumedCalories);
  }

  getCaloriePercentage(): number {
    // totalCalories가 유효한 값인지 확인
    if (!this.totalCalories || isNaN(this.totalCalories) || this.totalCalories <= 0) {
      return 0; // 기본값으로 0% 반환
    }

    // 소비된 칼로리 계산 - 실제 그램당 칼로리 반영
    const consumedCalories = this.getMeals().reduce(
      (total, meal) => total + meal.calculateActualCalories(),
      0
    );
    
    // 소비된 칼로리 퍼센티지 반환
    return Math.min(100, Math.round((consumedCalories / this.totalCalories) * 100));
  }

  getRecentMeals(): Meal[] {
    return this.getMeals().slice().reverse();
  }

  getSavedFoods(): Meal[] {
    return [...this.savedFoods];
  }

  getTotalCalories(): number {
    return this.totalCalories;
  }

  // 오늘 날짜의 식사만 반환
  getMeals(date?: string) {
    const d = date || this.getTodayString();
    return this.meals[d] || [];
  }

  // 이미지를 Base64로 변환하는 유틸리티 메소드 (옵션)
  static async imageToBase64(imageUri: string): Promise<string | null> {
    if (!imageUri) return null;
    
    try {
      // 웹 환경에서는 fetch를 사용해 이미지를 가져옴
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('이미지 변환 중 오류 발생:', error);
      return null;
    }
  }

  getConsumedMacros(date?: string) {
    const meals = this.getMeals(date);
    let protein = 0, carbs = 0, fat = 0;
    
    // 각 식사의 실제 섭취량을 계산
    for (const meal of meals) {
      const actualProtein = meal.calculateActualProtein();
      const actualCarbs = meal.calculateActualCarbs();
      const actualFat = meal.calculateActualFat();
      
      protein += actualProtein;
      carbs += actualCarbs;
      fat += actualFat;
    }

    // 소수점 첫째자리까지 반올림
    return {
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10
    };
  }
} 