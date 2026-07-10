import type { TProvider } from "@/types/ads/campaign";

export type TIntegrationProvider = TProvider;

/** 목록 API `platformAccounts[].status` */
export type TPlatformAccountApiStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "INACTIVE"
  | "DISCONNECTED";

export type TPlatformAuthType = "OAUTH";

export interface IPlatformAccountApi {
  platformAccountId: number;
  externalAccountId: string;
  provider: TIntegrationProvider;
  authType: TPlatformAuthType;
  status: TPlatformAccountApiStatus;
  tokenExpireAt?: string;
  syncedAt?: string;
}

export interface IPlatformAccountsResponseData {
  platformAccounts: IPlatformAccountApi[];
}

/** 카드 UI용 연동 상태 */
export type TPlatformConnectionStatus = "disconnected" | "connected" | "error";

export interface IPlatformConnectionItem {
  provider: TIntegrationProvider;
  status: TPlatformConnectionStatus;
  platformAccountId?: number;
  externalAccountId?: string;
  syncedAt?: string;
  tokenExpireAt?: string;
  errorMessage?: string;
}
