import { useCoreMutation } from "@/hooks/customQuery";

import { createTrackingUrl } from "@/api/ads/ads";
import { QUERY_KEYS } from "@/lib/queryKeys";

/** AdDetailContent — 트래킹 URL 발급 */
export interface ICreateTrackingUrlVariables {
  adContentId: number;
  landingUrl: string;
}

export function useCreateTrackingUrl(
  orgId: number | null,
  projectId: number | null,
) {
  return useCoreMutation<void, ICreateTrackingUrlVariables>(
    async (vars) => {
      if (orgId == null) {
        throw new Error("워크스페이스 정보가 없습니다.");
      }

      await createTrackingUrl(orgId, vars.adContentId, vars.landingUrl);
    },
    {
      invalidateKeys:
        orgId != null && projectId != null
          ? [QUERY_KEYS.campaign.ads(orgId, projectId)]
          : [],
    },
  );
}
