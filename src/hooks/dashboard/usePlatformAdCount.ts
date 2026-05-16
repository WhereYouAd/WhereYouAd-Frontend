import type { IAdStatusData } from "@/types/dashboard/platform";

import { useCoreQuery } from "@/hooks/customQuery";

import { getAdCount } from "@/api/dashboard/platform";
import useWorkspaceStore from "@/store/useWorkspaceStore";

// 광고 소재 현황
export function usePlatformAdCount() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery<IAdStatusData>(
    ["platform", "adCount", orgId],
    () => getAdCount(orgId!),
    { enabled: !!orgId },
  );
}
