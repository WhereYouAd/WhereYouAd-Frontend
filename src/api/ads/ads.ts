import type { ICampaign } from "@/types/ads/campaign";
import type { ICommonResponse } from "@/types/common/common";

import { axiosInstance } from "@/lib/axiosInstance";

export const getCampaignList = async (orgId: number): Promise<ICampaign[]> => {
  const { data } = await axiosInstance.get<
    ICommonResponse<{ projects: ICampaign[] }>
  >(`/api/project/${orgId}`);
  return data.data.projects;
};

export const updateAllCampaignStatus = async (
  orgId: number,
  status: "ON_GOING" | "PAUSED",
): Promise<void> => {
  await axiosInstance.patch(`/api/project/${orgId}/status`, null, {
    params: { status },
  });
};
