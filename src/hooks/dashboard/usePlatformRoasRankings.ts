import type { IRoasRanking } from "@/types/dashboard/overview";

import { useCoreQuery } from "@/hooks/customQuery";

import { getRoasRankings } from "@/api/dashboard/overview";
import useWorkspaceStore from "@/store/useWorkspaceStore";
// TODO: 추후 제거
const normalizeProvider = (provider: string): string =>
  provider === "KAKAO" ? "META" : provider;
// ROAS 성과 순위 (상위 3개)
export function usePlatformRoasRankings() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  return useCoreQuery(
    ["platform", "roasRankings", orgId],
    // TODO: 추후 제거
    () =>
      getRoasRankings(orgId!, {
        startDate: "2026-01-22",
        endDate: "2026-03-22",
      }),
    {
      enabled: !!orgId,
      select: (data): IRoasRanking[] =>
        data.rankings.map((item) => ({
          ...item,
          provider: normalizeProvider(item.provider),
        })),
    },
  );
}
