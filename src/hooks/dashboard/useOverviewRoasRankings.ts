import type { IPlatformRankingItem } from "@/types/dashboard/overview";
import {
  PLATFORM_MAP,
  PROVIDER_TYPES,
  type TProviderType,
} from "@/types/dashboard/provider";
import { OVERVIEW_DAILY_METRICS_RANGE } from "@/constants/dashboard/overviewMetricsRange";

import { fetchPlatformMetrics } from "@/utils/dashboard/platformMetricsQuery";

import { useCoreQuery } from "@/hooks/customQuery";

import { getRoasRankings } from "@/api/dashboard/overview";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const PROVIDERS: readonly TProviderType[] = PROVIDER_TYPES;

function toProviderType(provider: string): TProviderType | null {
  const key = provider.toUpperCase();
  if (key in PLATFORM_MAP) return key as TProviderType;
  return null;
}

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
        const providerKey = toProviderType(item.provider);
        const metrics = providerKey ? metricsMap[providerKey] : undefined;

        return {
          ...item,
          clicks: metrics?.clicks,
          clickDelta: metrics?.clickChangeRate,
          conversionRate: metrics?.conversion,
          conversionDelta: metrics?.cvrChangeRate,
        };
      });
    },
    { enabled: !!orgId },
  );
}
