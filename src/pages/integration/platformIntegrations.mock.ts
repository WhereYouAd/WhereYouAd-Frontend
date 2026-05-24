import type { IPlatformConnectionItem } from "@/types/integration/platformConnection";

export const platformConnectionsMock: IPlatformConnectionItem[] = [
  {
    provider: "META",
    status: "connected",
    lastSyncedAt: "2026-05-18T14:32:00",
  },
  {
    provider: "GOOGLE",
    status: "disconnected",
  },
  {
    provider: "NAVER",
    status: "error",
    errorMessage: "토큰이 만료되었습니다. 다시 연동해 주세요.",
    lastSyncedAt: "2026-05-10T12:09:00",
  },
];
