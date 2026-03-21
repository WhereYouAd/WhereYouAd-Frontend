import { useParams } from "react-router-dom";

import { useCoreQuery } from "@/hooks/customQuery";

import { getCampaignDetail } from "@/api/ads/ads";

export const useCampaignDetail = () => {
  const { orgId, projectId } = useParams<{
    orgId: string;
    projectId: string;
  }>();

  // URL 파라미터를 숫자로 변환
  const parsedOrgId = Number(orgId);
  const parsedProjectId = Number(projectId);

  // 유효한 ID일 때만 요청
  const isValid =
    Number.isFinite(parsedOrgId) &&
    parsedOrgId > 0 &&
    Number.isFinite(parsedProjectId) &&
    parsedProjectId > 0;

  return useCoreQuery(
    ["campaignDetail", parsedOrgId, parsedProjectId],
    () => getCampaignDetail(parsedOrgId, parsedProjectId),
    { enabled: isValid },
  );
};
