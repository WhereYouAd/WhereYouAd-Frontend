export interface IBudgetGaugeChartData {
  percentage: number; // 예산 소진률
  totalBudget: number; // 총 예산
  spent: number; // 현재 소진액
  warningThreshold: number; // 주의 기준 (이 값 이상이면 노랑)
  dangerThreshold: number; // 위험 기준 (이 값 이상이면 빨강)
}

// 목업 데이터
export const budgetGaugeChartMock: IBudgetGaugeChartData = {
  percentage: 75,
  totalBudget: 10000000,
  spent: 6200000,
  warningThreshold: 50,
  dangerThreshold: 75,
};
