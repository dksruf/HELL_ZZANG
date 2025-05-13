/**
 * Macro 모델
 *
 * 영양소(단백질, 탄수화물, 지방) 목표 및 현재 섭취량을 관리하는 데이터 모델입니다.
 * - name: 영양소 이름 (Protein, Carbs, Fat)
 * - current: 현재 섭취량
 * - total: 목표 섭취량
 * - unit: 단위 (g)
 * - color: 프로그레스바 색상
 *
 * 주요 메서드:
 * - getPercentage(): 목표 대비 섭취 비율(%)
 * - getRemaining(): 남은 섭취량
 * - addAmount(), subtractAmount(), resetCurrent(): 섭취량 조작
 */
export class Macro {
  constructor(
    public name: string,
    public current: number,
    public total: number,
    public unit: string,
    public color: string
  ) {}

  getPercentage(): number {
    if (!this.total || isNaN(this.total) || this.total <= 0) {
      return 0;
    }
    return Math.min(100, (this.current / this.total) * 100);
  }

  getRemaining(): number {
    if (isNaN(this.current) || isNaN(this.total)) {
      return 0;
    }
    return this.total - this.current;
  }

  addAmount(amount: number): void {
    this.current = Math.max(0, this.current + amount);
  }

  subtractAmount(amount: number): void {
    this.current = Math.max(0, this.current - amount);
  }

  resetCurrent(): void {
    this.current = 0;
  }
}

// 진한 색상 상수 추가
export const MACRO_COLORS = {
  Protein: '#FF6B6B', // 진한 빨강
  Carbs: '#FFB169',   // 진한 주황
  Fat: '#4DABF7',     // 진한 파랑
}; 