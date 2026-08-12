/** Meta / Google 일일 예산 수정 요청 */
export interface IMetaGoogleDailyBudgetUpdateRequest {
  dailyBudget: number;
}

/** Meta / Google 총 예산 수정 요청 */
export interface IMetaGoogleLifetimeBudgetUpdateRequest {
  lifetimeBudget: number;
}

/** Meta / Google 예산 수정 요청 — daily / lifetime 중 하나만 */
export type TMetaGoogleBudgetUpdateRequest =
  | IMetaGoogleDailyBudgetUpdateRequest
  | IMetaGoogleLifetimeBudgetUpdateRequest;

/** Naver 예산 수정 요청 */
export interface INaverBudgetUpdateRequest {
  useDailyBudget: boolean;
  dailyBudget: number;
}

/** 일일 / 총 예산 구분 — 상세·대시보드·수정 응답 공통 (OpenAPI: DAILY | TOTAL) */
export type TPlatformBudgetType = "DAILY" | "TOTAL";

/** @deprecated TPlatformBudgetType 사용 */
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
