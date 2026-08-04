import type { TStatus } from "@/types/ads/campaign";

import { useCoreMutation } from "@/hooks/customQuery";

import { updateAllCampaignStatus, updateCampaignStatus } from "@/api/ads/ads";
import { QUERY_KEYS } from "@/lib/queryKeys";

/** AdsListPage — 일괄 / 선택 캠페인 status 변경 */
export interface IUpdateCampaignStatusVariables {
  scope: "all" | "selection";
  status: Extract<TStatus, "ON_GOING" | "PAUSED">;
  projectIds?: number[];
}

export function useUpdateCampaignStatus(orgId: number | null) {
  return useCoreMutation<void, IUpdateCampaignStatusVariables>(
    async (vars) => {
      if (orgId == null) {
        throw new Error("워크스페이스 정보가 없습니다.");
      }

      if (vars.scope === "all") {
        await updateAllCampaignStatus(orgId, vars.status);
        return;
      }

      const projectIds = vars.projectIds ?? [];
      if (projectIds.length === 0) return;

      await Promise.all(
        projectIds.map((projectId) =>
          updateCampaignStatus(orgId, projectId, vars.status),
        ),
      );
    },
    {
      invalidateKeys: orgId != null ? [QUERY_KEYS.campaign.list(orgId)] : [],
    },
  );
}
