import type { ICommonResponse } from "@/types/common/common";
import type { IMetricsResponse } from "@/types/dashboard/overview";

import { axiosInstance } from "@/lib/axiosInstance";

// 대시보드 - 전체 지표 집계 API
export const getOverview = async (orgId: number): Promise<IMetricsResponse> => {
  const { data } = await axiosInstance.get<ICommonResponse<IMetricsResponse>>(
    `/api/dashboard/${orgId}/metrics`,
  );
  return data.data;
};
