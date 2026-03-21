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
  status: "ON_GOING" | "PAUSED" | "OVER",
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

export const getAdDetail = async (
  orgId: number,
  projectId: number,
  adContentId: number,
): Promise<IAd> => {
  const { data } = await axiosInstance.get<ICommonResponse<IAd>>(
    `/api/advertisement/${orgId}/projects/${projectId}/ad-contents/${adContentId}`,
  );
  return data.data;
};

export const updateAdStatus = async (
  orgId: number,
  projectId: number,
  adContentId: number,
  status: "ON_GOING" | "PAUSED" | "OVER",
): Promise<void> => {
  await axiosInstance.patch(
    `/api/advertisement/${orgId}/projects/${projectId}/ad-contents/${adContentId}/status`,
    null,
    {
      params: { status },
    },
  );
};
