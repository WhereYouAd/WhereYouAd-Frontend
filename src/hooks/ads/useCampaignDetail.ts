import { useParams } from "react-router-dom";

import { useCoreQuery } from "@/hooks/customQuery";

import { getCampaignDetail } from "@/api/ads/ads";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export const useCampaignDetail = () => {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  const { projectId } = useParams<{ projectId: string }>();

  return useCoreQuery(
    ["campaignDetail", orgId, projectId],
    () => getCampaignDetail(orgId!, Number(projectId)),
    { enabled: !!orgId && !!projectId },
  );
};
