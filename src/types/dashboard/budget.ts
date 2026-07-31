/** 게이지 1개 (전체 or 일일) */
export interface IBudgetSlice {
  label: "전체 예산" | "일일 예산";
  totalBudget: number;
  spent: number;
}

/** 어댑터가 만드는 ViewModel */
export interface IBudgetViewModel {
  lifetime: IBudgetSlice;
  daily?: IBudgetSlice;
}

/** BudgetGaugeChart에 넘기는 props */
export interface IBudgetGaugeProps extends IBudgetSlice {
  warningThreshold: number;
  dangerThreshold: number;
  compact?: boolean;
}

/** useBudget select 결과 */
export interface IBudgetQueryData {
  viewModel: IBudgetViewModel;
  lifetimeGauge: IBudgetGaugeProps;
  dailyGauge?: IBudgetGaugeProps;
}
