import type { ICampaign } from "@/types/ads/campaign";

import { useCoreQuery } from "@/hooks/customQuery";

import { getCampaignList } from "@/api/ads/ads";
import useWorkspaceStore from "@/store/useWorkspaceStore";

/** 캠페인 목록과 동일 쿼리 키로 캐시 공유 */
export function useOverviewCampaignList() {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  return useCoreQuery<ICampaign[]>(
    ["campaigns", orgId],
    () => getCampaignList(orgId!),
    { enabled: !!orgId },
  );
}
