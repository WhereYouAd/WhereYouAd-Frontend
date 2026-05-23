import type { TProvider } from "@/types/ads/campaign";

export type TIntegrationProvider = TProvider;

export type TPlatformConnectionStatus =
  | "disconnected"
  | "connected"
  | "error"
  | "syncing";

export interface IPlatformConnectionItem {
  provider: TIntegrationProvider;
  status: TPlatformConnectionStatus;
  /** 연동된 광고 계정 표시명 */
  accountLabel?: string;
  /** ISO 문자열 또는 화면용 문자열 */
  lastSyncedAt?: string;
  errorMessage?: string;
}
