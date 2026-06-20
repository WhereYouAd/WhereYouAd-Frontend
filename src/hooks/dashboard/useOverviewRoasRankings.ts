import type { IPlatformRankingItem } from "@/types/dashboard/overview";
import { PROVIDER_TYPES, type TProviderType } from "@/types/dashboard/provider";
import { OVERVIEW_DAILY_METRICS_RANGE } from "@/constants/dashboard/overviewMetricsRange";

import {
  calcClickRate,
  calcCtrChangeRate,
  fetchPlatformMetrics,
} from "@/utils/dashboard/platformMetricsQuery";

import { useCoreQuery } from "@/hooks/customQuery";

import { getRoasRankings } from "@/api/dashboard/overview";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const PROVIDERS: readonly TProviderType[] = PROVIDER_TYPES;

export function useOverviewRoasRankings() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery(
    QUERY_KEYS.overview.roasRankings(orgId),
    async (): Promise<IPlatformRankingItem[]> => {
      const [rankingsRes, ...metricsResults] = await Promise.all([
        getRoasRankings(orgId!, OVERVIEW_DAILY_METRICS_RANGE),
        ...PROVIDERS.map((p) =>
          fetchPlatformMetrics(orgId!, p).catch(() => null),
        ),
      ]);

      const metricsMap = Object.fromEntries(
        PROVIDERS.map((p, i) => [p, metricsResults[i]]),
      );

      return rankingsRes.rankings.map((item) => {
        const metrics = metricsMap[item.provider.toUpperCase()];

        return {
          ...item,
          clickRate: metrics ? calcClickRate(metrics) : undefined,
          ctrDelta: metrics ? calcCtrChangeRate(metrics) : undefined,
          conversionRate: metrics ? metrics.conversion : undefined,
          conversionDelta: metrics ? metrics.cvrChangeRate : undefined,
        };
      });
    },
    { enabled: !!orgId },
  );
}
