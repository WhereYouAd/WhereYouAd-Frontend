import type { TPlatformBudgetType } from "@/types/ads/budget";

export type TPlatform = "meta" | "google" | "naver"; //UI
export type TProvider = "META" | "GOOGLE" | "NAVER"; //API
export type TStatus = "ON_GOING" | "PAUSED" | "OVER";

/**
 * GET /api/project/{orgId}/{projectId} — platformBudgets[] 항목
 * OpenAPI: PlatformBudgetSummary
 */
export interface IPlatformBudgetSummary {
  provider: TProvider;
  budgetType: TPlatformBudgetType;
  budget: number;
  spend: number;
  remainingBudget: number;
  remainingPercentage: number;
  /** 예산 수정용 — 현재 OpenAPI 미포함, 내려오면 수정 활성화 */
  adCampaignId?: number;
  adCampaignName?: string;
  naverConnectionId?: number;
  naverCampaignId?: string;
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
  platformBudgets?: IPlatformBudgetSummary[];
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
