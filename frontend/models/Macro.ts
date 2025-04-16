export class Macro {
  constructor(
    public name: string,
    public current: number,
    public total: number,
    public unit: string,
    public color: string
  ) {}

  getPercentage(): number {
    return (this.current / this.total) * 100;
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