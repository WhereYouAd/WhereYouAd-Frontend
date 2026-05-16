import type { IRoasRanking } from "@/types/dashboard/overview";

import { useCoreQuery } from "@/hooks/customQuery";

import { getRoasRankings } from "@/api/dashboard/overview";
import useWorkspaceStore from "@/store/useWorkspaceStore";

// ROAS 성과 순위 (상위 3개)
export function usePlatformRoasRankings() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  return useCoreQuery(
    ["platform", "roasRankings", orgId],
    () =>
      getRoasRankings(orgId!, {
        startDate: "2026-01-22",
        endDate: "2026-03-22",
      }),
    {
      enabled: !!orgId,
      select: (data): IRoasRanking[] => data.rankings,
    },
  );
}
