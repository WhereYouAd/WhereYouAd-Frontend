/** 게이지 라벨 — groups.budgetType(TOTAL/DAILY) 매핑 */
export type TBudgetGaugeLabel = "전체 예산" | "일일 예산";

/** 게이지 1개 분량 */
export interface IBudgetSlice {
  label: TBudgetGaugeLabel;
  totalBudget: number;
  spent: number;
}

/** 어댑터가 만드는 ViewModel */
export interface IBudgetViewModel {
  slices: IBudgetSlice[];
}

/** BudgetGaugeChart에 넘기는 props */
export interface IBudgetGaugeProps extends IBudgetSlice {
  warningThreshold: number;
  dangerThreshold: number;
  /** 2게이지 등 세로 간격 축소 */
  compact?: boolean;
  /** 라벨 행 ↔ 남은 % 행 간격 추가 축소 (ads 상세 등) */
  tightHeader?: boolean;
  /** 하단 인사이트 멘트 표시 (compact와 별도) */
  showInsight?: boolean;
}

/** useBudget select 결과 */
export interface IBudgetQueryData {
  viewModel: IBudgetViewModel;
  gauges: IBudgetGaugeProps[];
}
