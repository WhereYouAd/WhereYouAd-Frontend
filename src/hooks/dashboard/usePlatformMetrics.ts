import type {
  IMetricsResponse,
  TProviderType,
} from "@/types/dashboard/overview";

import { useCoreQuery } from "@/hooks/customQuery";

import { getOverview } from "@/api/dashboard/overview";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

// 단일 플랫폼 지표 조회
export function usePlatformMetrics(provider: TProviderType) {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery<IMetricsResponse>(
    QUERY_KEYS.platform.metrics(orgId, provider),
    () => getOverview(orgId!, provider),
    {
      enabled: !!orgId && !!provider,
    },
  );
}
