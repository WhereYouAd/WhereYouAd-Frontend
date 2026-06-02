import type { IPlatformAccountApi } from "@/types/integration/platformConnection";

import { mapPlatformAccountsToConnections } from "@/utils/integration/mapPlatformAccounts";

/** 목록 API `data.platformAccounts` mock */
export const platformAccountsApiMock: IPlatformAccountApi[] = [
  {
    platformAccountId: 1,
    externalAccountId: "act_2847193056",
    provider: "META",
    authType: "OAUTH",
    status: "ACTIVE",
    tokenExpireAt: "2026-08-18",
    syncedAt: "2026-05-18T14:32:00",
  },
  {
    platformAccountId: 3,
    externalAccountId: "naver-ad-882910",
    provider: "NAVER",
    authType: "OAUTH",
    status: "EXPIRED",
    tokenExpireAt: "2026-05-20",
    syncedAt: "2026-05-10T12:09:00",
  },
];

export const platformConnectionsMock = mapPlatformAccountsToConnections(
  platformAccountsApiMock,
);
