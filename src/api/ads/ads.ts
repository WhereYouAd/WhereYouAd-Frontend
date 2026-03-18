import type { ICampaign, ICampaignDetail } from "@/types/ads/campaign";
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

export const getCampaignDetail = async (
  orgId: number,
  projectId: number,
): Promise<ICampaignDetail> => {
  const { data } = await axiosInstance.get<ICommonResponse<ICampaignDetail>>(
    `/api/project/${orgId}/${projectId}`,
  );
  return data.data;
};
