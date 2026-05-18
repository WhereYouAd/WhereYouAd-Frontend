import type { TProviderType } from "@/types/dashboard/overview";
import type {
  IMetricFactsResponse,
  IMetricFactsRow,
  IPlatformDailyPerformance,
  TPlatformProvider,
} from "@/types/dashboard/platform";

import { useCoreQuery } from "@/hooks/customQuery";

import { getMetricFacts } from "@/api/dashboard/platform";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function formatTableDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;

  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}(${DAY_LABELS[d.getDay()]})`;
}

function mapRow(row: IMetricFactsRow): IPlatformDailyPerformance {
  return {
    date: formatTableDate(row.date),
    spend: row.spend,
    impressions: row.impressions,
    clicks: row.clicks,
    ctr: row.ctr,
    cpa: row.cpa,
    conversions: row.conversions,
    roas: row.roas,
  };
}

function mapTotalRow(total: IMetricFactsRow): IPlatformDailyPerformance {
  return {
    date: "합계",
    spend: total.spend,
    impressions: total.impressions,
    clicks: total.clicks,
    ctr: total.ctr,
    cpa: total.cpa,
    conversions: total.conversions,
    roas: total.roas,
  };
}

export type TMetricFactsViewModel = {
  dailyRows: IPlatformDailyPerformance[];
  totalRow: IPlatformDailyPerformance;
};

export function usePlatformMetricFacts(
  provider: TPlatformProvider,
  days: 7 | 30,
) {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery<IMetricFactsResponse, TMetricFactsViewModel>(
    ["platform", "metricFacts", orgId, provider, days],
    () =>
      getMetricFacts(orgId!, {
        providerType: provider as TProviderType,
        days,
      }),
    {
      enabled: !!orgId && !!provider,
      select: (data) => ({
        dailyRows: [...data.dailyMetrics]
          .sort((a, b) => b.date.localeCompare(a.date))
          .map(mapRow),
        totalRow: mapTotalRow(data.total),
      }),
    },
  );
}
