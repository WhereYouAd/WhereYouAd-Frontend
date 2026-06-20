import type { IMetricsResponse } from "@/types/dashboard/common";
import type { TProviderType } from "@/types/dashboard/provider";

import { getOverview } from "@/api/dashboard/overview";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/lib/queryKeys";

export function platformMetricsQueryFn(
  orgId: number,
  provider: TProviderType,
): Promise<IMetricsResponse> {
  return getOverview(orgId, provider);
}

/** QUERY_KEYS.platform.metrics 캐시를 공유하며 플랫폼 지표 조회 */
export function fetchPlatformMetrics(orgId: number, provider: TProviderType) {
  return queryClient.fetchQuery({
    queryKey: QUERY_KEYS.platform.metrics(orgId, provider),
    queryFn: () => platformMetricsQueryFn(orgId, provider),
  });
}

/** CTR(%) = 클릭수 ÷ 노출수 × 100 */
export function calcClickRate(metrics: IMetricsResponse): number | undefined {
  if (metrics.impressions <= 0) return undefined;
  return (metrics.clicks / metrics.impressions) * 100;
}

/**
 * CTR 전기 대비 증감(%) — API 미제공 시 클릭·노출 변화율로 역산
 * (clickChangeRate, impressionChangeRate는 전기 대비 % 변화율)
 */
export function calcCtrChangeRate(
  metrics: IMetricsResponse,
): number | undefined {
  if (metrics.impressions <= 0) return undefined;

  const prevClickFactor = 1 + metrics.clickChangeRate / 100;
  const prevImpressionFactor = 1 + metrics.impressionChangeRate / 100;
  if (prevClickFactor === 0 || prevImpressionFactor === 0) return undefined;

  const prevClicks = metrics.clicks / prevClickFactor;
  const prevImpressions = metrics.impressions / prevImpressionFactor;
  if (prevImpressions <= 0) return undefined;

  const prevCtr = (prevClicks / prevImpressions) * 100;
  if (prevCtr === 0) return undefined;

  const currentCtr = (metrics.clicks / metrics.impressions) * 100;
  return ((currentCtr - prevCtr) / prevCtr) * 100;
}
