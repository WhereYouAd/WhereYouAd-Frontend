export type TPlatform = "kakao" | "google" | "naver";
export type TCampaignStatus = "ON_GOING" | "PAUSED" | "OVER";

// Campaign List
export interface ICampaign {
  projectId: number;
  name: string;
  providers: TPlatform[];
  status: TCampaignStatus;
  description?: string;
  budgetUsageRate: number;
}

// Campaign Detail
export interface ICampaignDetail extends ICampaign {
  budget: number;
  createdAt: string;
  ads: IAd[];
}

// Ad List
export interface IAd {
  id: number;
  name: string;
  runStatus: "running" | "stopped";
  runStatusText: string;
  platform: TPlatform[];
  description: string;
  tags: string[];
  link: string;
}
