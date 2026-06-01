export type TPlatform = "meta" | "google" | "naver"; //UI
export type TProvider = "META" | "GOOGLE" | "NAVER"; //API
export type TStatus = "ON_GOING" | "PAUSED" | "OVER";

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
  budget: number;
  createdAt: string;
  ads: IAd[];
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
