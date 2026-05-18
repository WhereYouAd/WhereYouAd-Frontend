import type { ICommonResponse } from "@/types/common/common";
import type {
  IAdCountParams,
  IAdStatusData,
  IMetricFactsParams,
  IMetricFactsResponse,
} from "@/types/dashboard/platform";

import { axiosInstance } from "@/lib/axiosInstance";

// 광고 소재 현황 조회 API
export const getAdCount = async (
  orgId: number,
  params?: IAdCountParams,
): Promise<IAdStatusData> => {
  const { data } = await axiosInstance.get<ICommonResponse<IAdStatusData>>(
    `/api/dashboard/${orgId}/ad-count`,
    { params },
  );
  return data.data;
};

// 광고 현황 상세 일별 조회 API
export const getMetricFacts = async (
  orgId: number,
  params?: IMetricFactsParams,
): Promise<IMetricFactsResponse> => {
  const { data } = await axiosInstance.get<
    ICommonResponse<IMetricFactsResponse>
  >(`/api/dashboard/${orgId}/metric-facts`, { params });
  return data.data;
};
