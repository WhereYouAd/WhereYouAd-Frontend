import type { TPlatformBudgetType } from "@/types/ads/budget";
import type { IBudgetAmountSlice } from "@/types/dashboard/common";

export type TPlatform = "meta" | "google" | "naver"; //UI
export type TProvider = "META" | "GOOGLE" | "NAVER"; //API
export type TStatus = "ON_GOING" | "PAUSED" | "OVER";

/** project 상세 — 플랫폼(매체 캠페인) 단위 예산 */
export interface IPlatformProjectBudget {
  providerType: TProvider;
  /** Meta / Google 예산 수정 path param */
  adCampaignId?: number;
  adCampaignName?: string;
  lifetime: IBudgetAmountSlice;
  /** Meta / Google — activeBudgetType에 따라 표시
   *  Naver — 일일 예산 */
  daily?: IBudgetAmountSlice | null;
  /** Meta / Google — 기존 daily / lifetime 중 어떤 유형인지 */
  activeBudgetType?: TPlatformBudgetType;
  /** Naver 일일 예산 수정 — /api/naver/{connectionId}/campaigns/{campaignId}/budget */
  naverConnectionId?: number;
  naverCampaignId?: string;
  /** 소유자 등 수정 가능 여부 */
  canEditBudget?: boolean;
}

// Ad List
export interface IAd {
  id: number;
  name: string;
  /** API가 `TProvider` 단일 값 또는 배열로 줄 수 있음 */
  provider?: TProvider[] | TProvider;
  /** 일부 응답은 `provider` 대신 이 필드만 포함 */
  providerType?: TProvider;
  status: TStatus;

  trackingUrl?: string;
  landingUrl?: string;
  description?: string;
  targetInfo?: string;

  platform?: TPlatform;
  runStatus?: "running" | "stopped";
  runStatusText?: string;
}

// Campaign List
export interface ICampaign {
  projectId: number;
  name: string;
  providers: TPlatform[];
  status: TStatus;
  description?: string;
  budgetUsageRate: number;
}

// Campaign Detail
export interface ICampaignDetail extends ICampaign {
  /** @deprecated BE platformBudgets 전환 후 제거 예정 */
  budget: number;
  createdAt: string;
  ads: IAd[];
  platformBudgets?: IPlatformProjectBudget[];
}

export interface IPlatformCampaign {
  adCampaignId: number;
  name: string;
  description: string;
}

export interface ICreateCampaignGroupRequest {
  name: string;
  description: string;
  campaignIds: number[];
}
