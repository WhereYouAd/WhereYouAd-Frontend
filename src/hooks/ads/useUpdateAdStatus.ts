import type { TStatus } from "@/types/ads/campaign";

import { useCoreMutation } from "@/hooks/customQuery";

import { updateAdStatus } from "@/api/ads/ads";
import { QUERY_KEYS } from "@/lib/queryKeys";

/** CampaignDetail — 선택/전체 광고 소재 status 변경 (id 목록은 페이지에서 계산) */
export interface IUpdateAdStatusVariables {
  adContentIds: number[];
  status: Extract<TStatus, "ON_GOING" | "PAUSED">;
}

export function useUpdateAdStatus(
  orgId: number | null,
  projectId: number | null,
) {
  return useCoreMutation<void, IUpdateAdStatusVariables>(
    async (vars) => {
      if (orgId == null || projectId == null) {
        throw new Error("캠페인 정보가 없습니다.");
      }

      if (vars.adContentIds.length === 0) return;

      await Promise.all(
        vars.adContentIds.map((adContentId) =>
          updateAdStatus(orgId, projectId, adContentId, vars.status),
        ),
      );
    },
    {
      invalidateKeys:
        orgId != null && projectId != null
          ? [QUERY_KEYS.campaign.ads(orgId, projectId)]
          : [],
    },
  );
}
