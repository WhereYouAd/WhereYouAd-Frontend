import type {
  IAdStatusData,
  TPlatformProvider,
} from "@/types/dashboard/platform";

import { useCoreQuery } from "@/hooks/customQuery";

import { getAdCount } from "@/api/dashboard/platform";
import useWorkspaceStore from "@/store/useWorkspaceStore";

// TODO: 추후 제거
const normalizeProvider = (provider: string): TPlatformProvider =>
  provider === "KAKAO" ? "META" : (provider as TPlatformProvider);

// 광고 소재 현황
export function usePlatformAdCount() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery<IAdStatusData>(
    ["platform", "adCount", orgId],
    () => getAdCount(orgId!),
    {
      enabled: !!orgId,
      select: (data): IAdStatusData => ({
        ...data,
        providerCount: data.providerCount.map((item) => ({
          ...item,
          provider: normalizeProvider(item.provider),
        })),
      }),
    },
  );
}
