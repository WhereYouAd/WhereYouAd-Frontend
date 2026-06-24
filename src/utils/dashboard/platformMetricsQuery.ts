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
