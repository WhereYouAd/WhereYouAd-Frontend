import { useParams } from "react-router-dom";

import { useCoreQuery } from "@/hooks/customQuery";

import { getCampaignDetail } from "@/api/ads/ads";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useCampaignDetail = (options?: { enabled?: boolean }) => {
  const { orgId, projectId } = useParams<{
    orgId: string;
    projectId: string;
  }>();

  const parsedOrgId = Number(orgId);
  const parsedProjectId = Number(projectId);

  const isValid =
    Number.isFinite(parsedOrgId) &&
    parsedOrgId > 0 &&
    Number.isFinite(parsedProjectId) &&
    parsedProjectId > 0;

  return useCoreQuery(
    QUERY_KEYS.campaign.detail(parsedOrgId, parsedProjectId),
    () => getCampaignDetail(parsedOrgId, parsedProjectId),
    { enabled: isValid && (options?.enabled ?? true) },
  );
};
