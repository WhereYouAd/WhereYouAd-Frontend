/** Meta / Naver sync 공통 count 응답 */
export interface IPlatformSyncCountData {
  adCampaignCount: number;
  adGroupCount: number;
  adContentCount: number;
  metricCount: number;
}

export interface IMetaSyncData extends IPlatformSyncCountData {
  failedAccountIds: string[];
}

export interface INaverSyncRequest {
  startDate: string; // "yyyy-MM-dd"
  endDate: string;
}

export interface INaverSyncData extends IPlatformSyncCountData {
  failedConnectionIds: number[];
}

export interface IGoogleSyncData {
  message: string;
}
