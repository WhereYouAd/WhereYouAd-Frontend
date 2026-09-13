import { useCoreMutation } from "@/hooks/customQuery";

import { deleteTrackingUrl } from "@/api/ads/ads";
import { QUERY_KEYS } from "@/lib/queryKeys";

/** 트래킹 URL 삭제 */
export interface IDeleteTrackingUrlVariables {
  adContentId: number;
}

export function useDeleteTrackingUrl(
  orgId: number | null,
  projectId: number | null,
) {
  return useCoreMutation<void, IDeleteTrackingUrlVariables>(
    async (vars) => {
      if (orgId == null) {
        throw new Error("워크스페이스 정보가 없습니다.");
      }

      await deleteTrackingUrl(orgId, vars.adContentId);
    },
    {
      invalidateKeys:
        orgId != null && projectId != null
          ? [QUERY_KEYS.campaign.ads(orgId, projectId)]
          : [],
    },
  );
}
