export class Meal {
  constructor(
    public name: string,
    public calories: number,
    public time: string,
    public protein: number,
    public carbs: number,
    public fat: number,
    public grams: number,
    public imageUri?: string
  ) {}

  calculateActualCalories(): number {
    return (this.calories * this.grams) / 100;
  }

  calculateActualProtein(): number {
    return (this.protein * this.grams) / 100;
  }

  calculateActualCarbs(): number {
    return (this.carbs * this.grams) / 100;
  }

  calculateActualFat(): number {
    return (this.fat * this.grams) / 100;
  }

  static fromFormData(
    name: string,
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    grams: number,
    imageUri?: string
  ): Meal {
    return new Meal(
      name,
      calories,
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      protein,
      carbs,
      fat,
      grams,
      imageUri
    );
  }
} 