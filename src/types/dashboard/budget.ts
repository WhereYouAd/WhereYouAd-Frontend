/** 게이지 라벨 */
export type TBudgetGaugeLabel =
  | "전체 예산"
  | "일일 예산"
  | "Google·Meta"
  | "NAVER";

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
  compact?: boolean;
}

/** useBudget select 결과 */
export interface IBudgetQueryData {
  viewModel: IBudgetViewModel;
  gauges: IBudgetGaugeProps[];
}
