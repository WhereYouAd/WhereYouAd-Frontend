import type { IRoasRanking } from "@/types/dashboard/overview";
import { OVERVIEW_DAILY_METRICS_RANGE } from "@/constants/dashboard/overviewMetricsRange";

import { useCoreQuery } from "@/hooks/customQuery";

import { getRoasRankings } from "@/api/dashboard/overview";
import useWorkspaceStore from "@/store/useWorkspaceStore";

// ROAS 성과 순위 (상위 3개)
export function usePlatformRoasRankings() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  return useCoreQuery(
    ["platform", "roasRankings", orgId],
    () => getRoasRankings(orgId!, OVERVIEW_DAILY_METRICS_RANGE),
    {
      enabled: !!orgId,
      select: (data): IRoasRanking[] => data.rankings,
    },
  );
}
