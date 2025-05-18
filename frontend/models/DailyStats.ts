export class DailyStats {
  constructor(
    public date: string,
    public totalCalories: number,
    public targetCalories: number,
    public totalProtein: number,
    public targetProtein: number,
    public totalCarbs: number,
    public targetCarbs: number,
    public totalFat: number,
    public targetFat: number,
    public imageCount: number
  ) {}

  getCaloriesProgress(): number {
    return (this.totalCalories / this.targetCalories) * 100;
  }

  getProteinProgress(): number {
    return (this.totalProtein / this.targetProtein) * 100;
  }

  getCarbsProgress(): number {
    return (this.totalCarbs / this.targetCarbs) * 100;
  }

  getFatProgress(): number {
    return (this.totalFat / this.targetFat) * 100;
  }

  static fromJSON(json: any): DailyStats {
    return new DailyStats(
      json.date,
      json.totalCalories,
      json.targetCalories,
      json.totalProtein,
      json.targetProtein,
      json.totalCarbs,
      json.targetCarbs,
      json.totalFat,
      json.targetFat,
      json.imageCount
    );
  }
} 