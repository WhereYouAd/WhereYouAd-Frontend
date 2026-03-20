import type { IAd, ICampaign, ICampaignDetail } from "@/types/ads/campaign";
import type { ICommonResponse } from "@/types/common/common";

import { axiosInstance } from "@/lib/axiosInstance";

interface IAdListResponse {
  adContentInfoResponses: IAd[];
}

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

export const updateCampaignStatus = async (
  orgId: number,
  projectId: number,
  status: "ON_GOING" | "PAUSED",
): Promise<void> => {
  await axiosInstance.patch(
    `/api/advertisement/${orgId}/projects/${projectId}/status`,
    null,
    {
      params: { status },
    },
  );
};

export const getAdList = async (
  orgId: number,
  projectId: number,
): Promise<IAd[]> => {
  const { data } = await axiosInstance.get<ICommonResponse<IAdListResponse>>(
    `/api/advertisement/${orgId}/projects/${projectId}/ad-contents`,
  );
  return data.data.adContentInfoResponses;
};
