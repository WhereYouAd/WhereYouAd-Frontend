import { useQueryClient } from "@tanstack/react-query";

import type { TStatus } from "@/types/ads/campaign";

import {
  assertBulkSettleResult,
  settleBulkRequests,
} from "@/utils/ads/settleBulkRequests";

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
  const queryClient = useQueryClient();

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

      const result = await settleBulkRequests(
        projectIds.map((projectId) =>
          updateCampaignStatus(orgId, projectId, vars.status),
        ),
      );

      if (result.successCount > 0 && result.successCount < result.total) {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.campaign.list(orgId),
        });
      }

      assertBulkSettleResult(result, {
        partial: (successCount, total) =>
          `${total}개 중 ${successCount}개 캠페인만 반영되었습니다.`,
      });
    },
    {
      invalidateKeys: orgId != null ? [QUERY_KEYS.campaign.list(orgId)] : [],
    },
  );
}
