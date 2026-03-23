import type { ICommonResponse } from "@/types/common/common";
import type {
  IMetricsResponse,
  IRoasRankingsParams,
  IRoasRankingsResponse,
  TProviderType,
} from "@/types/dashboard/overview";

import { axiosInstance } from "@/lib/axiosInstance";

// 대시보드 - 전체 지표 집계 API
export const getOverview = async (
  orgId: number,
  providerType?: TProviderType,
): Promise<IMetricsResponse> => {
  const { data } = await axiosInstance.get<ICommonResponse<IMetricsResponse>>(
    `/api/dashboard/${orgId}/metrics`,
    { params: providerType ? { providerType } : undefined },
  );
  return data.data;
};

// 대시보드 - ROAS 성과 순위 조회 API
export const getRoasRankings = async (
  orgId: number,
  params?: IRoasRankingsParams,
): Promise<IRoasRankingsResponse> => {
  const { data } = await axiosInstance.get<
    ICommonResponse<IRoasRankingsResponse>
  >(`/api/dashboard/${orgId}/rankings/roas`, { params });
  return data.data;
};
