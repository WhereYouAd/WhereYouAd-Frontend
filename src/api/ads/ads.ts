import type { ICampaign } from "@/types/ads/campaign";

import type { IApiResult } from "../common/common";

import { axiosInstance } from "@/lib/axiosInstance";

export const getCampaignList = async (orgId: number): Promise<ICampaign[]> => {
  const { data } = await axiosInstance.get<
    IApiResult<{ projects: ICampaign[] }>
  >(`/api/project/${orgId}`);
  return data.data.projects;
};

// export const getCampaignDetail = async (projectId: number): Promise<ICampaignDetail> => {
//   const { data } = await axiosInstance.get<IApiResult<ICampaignDetail>>(
//     `/api/project/detail/${projectId}`
//   );
//   return data.data;
// };
