import type {
  IAd,
  ICampaign,
  ICampaignDetail,
  ICreateCampaignGroupRequest,
  IPlatformCampaign,
  TProvider,
} from "@/types/ads/campaign";
import type { ICommonResponse } from "@/types/common/common";

import { axiosInstance } from "@/lib/axiosInstance";

interface IAdListResponse {
  adContentInfoResponses: IAd[];
}

interface ITrackingUrlResponse {
  trackingUrl: string;
}

interface IPlatformCampaignResponse {
  adCampaigns: IPlatformCampaign[];
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

export const createTrackingUrl = async (
  orgId: number,
  adContentId: number,
  landingUrl: string,
): Promise<ITrackingUrlResponse> => {
  const { data } = await axiosInstance.post<
    ICommonResponse<ITrackingUrlResponse>
  >(`/api/clicks/${orgId}/${adContentId}/tracking-url`, {
    landingUrl,
  });
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

export const getPlatformCampaigns = async (
  orgId: number,
  providerType: TProvider,
): Promise<IPlatformCampaign[]> => {
  const { data } = await axiosInstance.get<
    ICommonResponse<IPlatformCampaignResponse>
  >(`api/advertisement/${orgId}/campaigns`, { params: { providerType } });
  return data.data.adCampaigns;
};

export const createCampaignGroup = async (
  orgId: number,
  body: ICreateCampaignGroupRequest,
): Promise<void> => {
  await axiosInstance.post(`/api/project/create/${orgId}`, body);
};
