/** Meta / Google 예산 수정 요청 */
export interface IMetaGoogleBudgetUpdateRequest {
  dailyBudget?: number;
  lifetimeBudget?: number;
}

/** Naver 예산 수정 요청 */
export interface INaverBudgetUpdateRequest {
  useDailyBudget: boolean;
  dailyBudget: number;
}

/** 일일 / 총 예산 구분 — 상세 API·수정 응답 공통 */
export type TPlatformBudgetType = "DAILY" | "LIFETIME";

/** Meta 상세 platformBudgets.activeBudgetType */
export type TMetaActiveBudgetType = TPlatformBudgetType;

/**
 * Meta / Google 예산 수정 응답 data
 * — 성공 toast 등에만 사용, UI 갱신은 detail refetch
 */
export interface IMetaGoogleBudgetUpdateData {
  updatedBudget: number;
  budgetType: TPlatformBudgetType;
}

/**
 * Naver 예산 수정 응답 data
 * — 성공 확인용, UI 갱신은 detail refetch
 */
export interface INaverBudgetUpdateData {
  dailyBudget: number;
  useDailyBudget: boolean;
}
