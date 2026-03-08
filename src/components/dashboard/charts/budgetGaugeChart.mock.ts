export interface IBudgetGaugeChartData {
  totalBudget: number; // 총 예산
  spent: number; // 현재 소진액
  warningThreshold: number; // 주의
  dangerThreshold: number; // 위험
}

// 목업 데이터
export const budgetGaugeChartMock: IBudgetGaugeChartData = {
  totalBudget: 10000000,
  spent: 6200000,
  warningThreshold: 50,
  dangerThreshold: 75,
};
