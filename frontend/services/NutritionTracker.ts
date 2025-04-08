import { Macro } from '../models/Macro';
import { Meal } from '../models/Meal';

export class NutritionTracker {
  private macros: Macro[];
  private recentMeals: Meal[];
  private savedFoods: Meal[];

  constructor(
    public totalCalories: number,
    initialMacros: Macro[],
    initialMeals: Meal[] = [],
    initialSavedFoods: Meal[] = []
  ) {
    this.macros = initialMacros;
    this.recentMeals = initialMeals;
    this.savedFoods = initialSavedFoods;
  }

  addMeal(meal: Meal): void {
    this.recentMeals.unshift(meal);
    this.updateMacros(meal);
  }

  removeMeal(index: number): void {
    if (index < 0 || index >= this.recentMeals.length) {
      throw new Error('유효하지 않은 인덱스입니다.');
    }
    const mealToRemove = this.recentMeals[index];
    this.subtractMacros(mealToRemove);
    this.recentMeals.splice(index, 1);
  }

  saveFood(meal: Meal): void {
    this.savedFoods.push(meal);
  }

  removeSavedFood(index: number): void {
    this.savedFoods.splice(index, 1);
  }

  getMacros(): Macro[] {
    return this.macros;
  }

  getRecentMeals(): Meal[] {
    return this.recentMeals;
  }

  getSavedFoods(): Meal[] {
    return this.savedFoods;
  }

  setTotalCalories(calories: number): void {
    this.totalCalories = calories;
  }

  setMacros(macros: Macro[]): void {
    this.macros = macros.map(macro => new Macro(macro.name, macro.current, macro.total, macro.unit, macro.color));
  }

  getCaloriesLeft(): number {
    const consumed = this.recentMeals.reduce((sum, meal) => sum + meal.calculateActualCalories(), 0);
    return Math.max(0, this.totalCalories - consumed);
  }

  getCaloriePercentage(): number {
    const consumed = this.recentMeals.reduce((sum, meal) => sum + meal.calculateActualCalories(), 0);
    return Math.min((consumed / this.totalCalories) * 100, 100);
  }

  private updateMacros(meal: Meal): void {
    this.macros[0].addAmount(meal.calculateActualProtein());
    this.macros[1].addAmount(meal.calculateActualCarbs());
    this.macros[2].addAmount(meal.calculateActualFat());
  }

  private subtractMacros(meal: Meal): void {
    this.macros[0].subtractAmount(meal.calculateActualProtein());
    this.macros[1].subtractAmount(meal.calculateActualCarbs());
    this.macros[2].subtractAmount(meal.calculateActualFat());
  }
} 