import { Macro } from '../models/Macro';
import { Meal } from '../models/Meal';
import { DailyStats } from '../models/DailyStats';
import { User } from '../models/User';
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
  private dailyStats: { [date: string]: DailyStats } = {};
  private currentUser: User | null = null;
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
        this.isInitialized = true;  // 초기화 완료 표시를 먼저 설정
        await this.loadFromStorage();
      } catch (error) {
        console.error('데이터 초기화 실패:', error);
      }
    }
  }

  // 사용자 설정
  async setCurrentUser(user: User) {
    this.currentUser = user;
    await this.loadFromStorage();
  }

  // 현재 사용자 가져오기
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  private async loadFromStorage() {
    if (!this.isWeb || !this.currentUser) return;  // isInitialized 체크 제거

    try {
      // 설정 로드
      const settings = await storageService.getData('settings', `${this.currentUser.name}_current`);
      if (settings) {
        this.totalCalories = settings.totalCalories;
        this.macros = settings.macros.map((m: any) => new Macro(
          m.name,
          m.current || 0,
          m.total !== undefined ? m.total : (m.target || 0),
          m.unit || 'g',
          m.color
        ));
      }

      // 식사 데이터 로드
      const meals = await storageService.getData('meals');
      if (meals) {
        this.meals = meals
          .filter((m: any) => m.userName === this.currentUser?.name)
          .reduce((acc, m) => {
            const date = m.date || this.getTodayString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(this.createMealFromStoredData(m));
            return acc;
          }, {} as { [date: string]: Meal[] });
      }

      // 저장된 음식 로드
      const savedFoods = await storageService.getData('savedFoods');
      if (savedFoods) {
        this.savedFoods = savedFoods
          .filter((f: any) => f.userName === this.currentUser?.name)
          .map((f: any) => this.createMealFromStoredData(f));
      }

      // 일별 통계 로드
      const dailyStats = await storageService.getData('dailyStats');
      if (dailyStats) {
        this.dailyStats = dailyStats
          .filter((stat: any) => stat.userName === this.currentUser?.name)
          .reduce((acc, stat) => {
            acc[stat.date] = DailyStats.fromJSON(stat);
            return acc;
          }, {} as { [date: string]: DailyStats });
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  }

  private async saveToStorage() {
    if (!this.isWeb || !this.isInitialized || !this.currentUser) return;

    try {
      // 설정 저장
      await storageService.saveData('settings', {
        id: `${this.currentUser.name}_current`,
        totalCalories: this.totalCalories,
        macros: this.macros
      });

      // 식사 데이터 저장
      await storageService.clearStore('meals');
      for (const date in this.meals) {
        for (const meal of this.meals[date]) {
          await storageService.saveData('meals', {
            userName: this.currentUser.name,
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
          userName: this.currentUser.name,
          name: food.name,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          grams: food.grams,
          imageUri: food.imageUri
        });
      }

      // 일별 통계 저장
      await storageService.clearStore('dailyStats');
      for (const date in this.dailyStats) {
        await storageService.saveData('dailyStats', {
          userName: this.currentUser.name,
          date: date,
          totalCalories: this.dailyStats[date].totalCalories,
          targetCalories: this.dailyStats[date].targetCalories,
          totalProtein: this.dailyStats[date].totalProtein,
          targetProtein: this.dailyStats[date].targetProtein,
          totalCarbs: this.dailyStats[date].totalCarbs,
          targetCarbs: this.dailyStats[date].targetCarbs,
          totalFat: this.dailyStats[date].totalFat,
          targetFat: this.dailyStats[date].targetFat,
          imageCount: this.dailyStats[date].imageCount
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
      mealData.name || '',
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
    this.updateDailyStats(date);
    
    // 백엔드에 로그 저장 (imageUri와 goal 관련 필드 제외)
    try {
      // 사용자 이름 유효성 검사
      if (!this.currentUser?.name) {
        console.warn('사용자 로그인 정보가 없어 로그를 저장할 수 없습니다.');
        return;
      }

      const response = await fetch(`http://localhost:8000/user-logs/${this.currentUser.name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          grams: meal.grams,
          date: date,
          goalCalories: this.totalCalories,
          goalProtein: this.macros[0].total,
          goalCarbs: this.macros[1].total,
          goalFat: this.macros[2].total,
          hasImage: !!meal.imageUri
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '로그 저장 실패');
      }
    } catch (error) {
      console.error('백엔드 로그 저장 실패:', error);
    }
    
    await this.saveToStorage();
  }

  async updateMeal(date: string, index: number, meal: Meal) {
    if (date in this.meals && index >= 0 && index < this.meals[date].length) {
      this.meals[date][index] = meal;
      this.updateDailyStats(date);
      await this.saveToStorage();
    }
  }

  async deleteMeal(date: string, index: number) {
    if (date in this.meals && index >= 0 && index < this.meals[date].length) {
      this.meals[date].splice(index, 1);
      this.updateDailyStats(date);
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

    // 실제 섭취 칼로리 합산 (환산 없이)
    const consumedCalories = this.getMeals().reduce(
      (total, meal) => total + meal.calories,
      0
    );
    return this.totalCalories - consumedCalories;
  }

  getCaloriePercentage(): number {
    // totalCalories가 유효한 값인지 확인
    if (!this.totalCalories || isNaN(this.totalCalories) || this.totalCalories <= 0) {
      return 0; // 기본값으로 0% 반환
    }

    // 소비된 칼로리 계산 (환산 없이)
    const consumedCalories = this.getMeals().reduce(
      (total, meal) => total + meal.calories,
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
      protein += meal.protein;
      carbs += meal.carbs;
      fat += meal.fat;
    }

    // 소수점 첫째자리까지 반올림
    return {
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10
    };
  }

  private updateDailyStats(date: string) {
    const meals = this.getMeals(date);
    const consumedMacros = this.getConsumedMacros(date);
    const imageCount = meals.filter(meal => meal.imageUri).length;

    this.dailyStats[date] = new DailyStats(
      date,
      this.getTotalCaloriesConsumed(date),
      this.totalCalories,
      consumedMacros.protein,
      this.macros.find(m => m.name === 'protein')?.total || 0,
      consumedMacros.carbs,
      this.macros.find(m => m.name === 'carbs')?.total || 0,
      consumedMacros.fat,
      this.macros.find(m => m.name === 'fat')?.total || 0,
      imageCount
    );
  }

  private getTotalCaloriesConsumed(date?: string): number {
    const meals = this.getMeals(date);
    return meals.reduce((total, meal) => total + meal.calculateActualCalories(), 0);
  }

  // 일별 통계 조회
  getDailyStats(date?: string): DailyStats | null {
    const d = date || this.getTodayString();
    return this.dailyStats[d] || null;
  }

  // 특정 기간의 통계 조회
  getStatsForDateRange(startDate: string, endDate: string): DailyStats[] {
    const stats: DailyStats[] = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (this.dailyStats[dateStr]) {
        stats.push(this.dailyStats[dateStr]);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return stats;
  }

  // 사용자별 통계 조회
  async getUserStats(userName: string, startDate: string, endDate: string): Promise<{
    user: User | null;
    stats: DailyStats[];
    totalMeals: number;
    totalImages: number;
    averageCalories: number;
    averageProtein: number;
    averageCarbs: number;
    averageFat: number;
  }> {
    const user = await storageService.getData('users', userName);
    const stats = await this.getStatsForDateRange(startDate, endDate);
    
    const totalMeals = stats.reduce((sum, stat) => {
      const meals = this.getMeals(stat.date);
      return sum + meals.length;
    }, 0);

    const totalImages = stats.reduce((sum, stat) => sum + stat.imageCount, 0);
    
    const averageCalories = stats.reduce((sum, stat) => sum + stat.totalCalories, 0) / stats.length;
    const averageProtein = stats.reduce((sum, stat) => sum + stat.totalProtein, 0) / stats.length;
    const averageCarbs = stats.reduce((sum, stat) => sum + stat.totalCarbs, 0) / stats.length;
    const averageFat = stats.reduce((sum, stat) => sum + stat.totalFat, 0) / stats.length;

    return {
      user: user ? User.fromJSON(user) : null,
      stats,
      totalMeals,
      totalImages,
      averageCalories,
      averageProtein,
      averageCarbs,
      averageFat
    };
  }

  // 모든 사용자의 통계 조회
  async getAllUsersStats(startDate: string, endDate: string): Promise<{
    userName: string;
    totalMeals: number;
    totalImages: number;
    averageCalories: number;
    averageProtein: number;
    averageCarbs: number;
    averageFat: number;
  }[]> {
    const users = await storageService.getData('users');
    const stats: any[] = [];

    for (const user of users) {
      const userStats = await this.getUserStats(user.name, startDate, endDate);
      stats.push({
        userName: user.name,
        totalMeals: userStats.totalMeals,
        totalImages: userStats.totalImages,
        averageCalories: userStats.averageCalories,
        averageProtein: userStats.averageProtein,
        averageCarbs: userStats.averageCarbs,
        averageFat: userStats.averageFat
      });
    }

    return stats;
  }
} 