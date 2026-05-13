import type {
  IMetricsResponse,
  TProviderType,
} from "@/types/dashboard/overview";
import type { TPlatformProvider } from "@/types/dashboard/platform";

import { useCoreQuery } from "@/hooks/customQuery";

import { getOverview } from "@/api/dashboard/overview";
import useWorkspaceStore from "@/store/useWorkspaceStore";

// TODO: 추후 제거
const toBackendProvider = (provider: TPlatformProvider): TProviderType =>
  provider === "META" ? "KAKAO" : (provider as TProviderType);

// 단일 플랫폼 지표 조회
export function usePlatformMetrics(provider: TPlatformProvider) {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery<IMetricsResponse>(
    ["platform", "metrics", orgId, provider],
    () => getOverview(orgId!, toBackendProvider(provider)),
    {
      enabled: !!orgId && !!provider,
    },
  );
}
