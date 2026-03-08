export type TPlatform = "kakao" | "google" | "naver";
export type TCampaignStatus = "inactive" | "syncing" | "success";

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

export interface ICampaign {
  id: number;
  name: string;
  platforms: TPlatform[];
  status: TCampaignStatus;
  statusText: string;
  progress: number;
  runStatus: "running" | "stopped";
  runStatusText: string;
  budget: string;
  startDate: string;
  description?: string;
  ads: IAd[];
}
