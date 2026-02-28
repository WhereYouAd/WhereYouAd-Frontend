export type TPlatform = "kakao" | "google" | "naver";
export type TCampaignStatus = "inactive" | "syncing" | "success";

export interface ICampaign {
  id: number;
  platforms: TPlatform[];
  name: string;
  status: TCampaignStatus;
  statusText: string;
  progress: number;
}
