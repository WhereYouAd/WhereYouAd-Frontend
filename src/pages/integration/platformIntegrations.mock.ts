import type { IPlatformConnectionItem } from "@/types/integration/platformConnection";

export const platformConnectionsMock: IPlatformConnectionItem[] = [
  {
    provider: "META",
    status: "connected",
    accountLabel: "Meta Ads · 메인 계정",
    lastSyncedAt: "2026-05-18T14:32:00",
  },
  {
    provider: "GOOGLE",
    status: "disconnected",
  },
  {
    provider: "NAVER",
    status: "error",
    accountLabel: "네이버 검색광고",
    errorMessage: "토큰이 만료되었습니다. 다시 연동해 주세요.",
  },
];
