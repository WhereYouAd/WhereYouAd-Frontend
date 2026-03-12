import type { ICampaign } from "@/types/ads/campaign";

import type { IApiResult } from "../common/common";

import { axiosInstance } from "@/lib/axiosInstance";

export const getCampaignList = async (orgId: number): Promise<ICampaign[]> => {
  const { data } = await axiosInstance.get<IApiResult<ICampaign[]>>(
    `/api/project/${orgId}`,
  );

  return data.data;
};
