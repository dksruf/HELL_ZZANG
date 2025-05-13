/**
 * Meal 모델
 *
 * 한 끼 식사의 영양 정보와 날짜, 이미지를 관리하는 데이터 모델입니다.
 * - name: 음식 이름
 * - calories: 100g당 칼로리
 * - protein, carbs, fat: 100g당 영양성분(g)
 * - grams: 실제 섭취량(g)
 * - imageUri: 음식 사진(선택)
 * - date: 식사 날짜(YYYY-MM-DD)
 *
 * 주요 메서드:
 * - calculateActualCalories(): 실제 섭취 칼로리
 * - calculateActualProtein/Carbs/Fat(): 실제 섭취 영양성분
 * - fromFormData(), fromJSON(): 생성자 헬퍼
 */
export class Meal {
  date: string;
  constructor(
    public name: string,
    public calories: number,
    public protein: number,
    public carbs: number,
    public fat: number,
    public grams: number,
    public imageUri?: string,
    date?: string
  ) {
    this.date = date || getTodayString();
  }

  calculateActualCalories(): number {
    return Math.round((this.calories * this.grams) / 100);
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
    imageUri?: string,
    date?: string
  ): Meal {
    return new Meal(
      name,
      calories,
      protein,
      carbs,
      fat,
      grams,
      imageUri,
      date || getTodayString()
    );
  }

  static fromJSON(json: any): Meal {
    return new Meal(
      json.name,
      json.calories,
      json.protein,
      json.carbs,
      json.fat,
      json.grams,
      json.imageUri,
      json.date
    );
  }
}

function getTodayString() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
} 