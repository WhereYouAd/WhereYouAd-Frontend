import type { ICommonResponse } from "@/types/common/common";
import type { IMetricsResponse } from "@/types/dashboard/overview";

import { axiosInstance } from "@/lib/axiosInstance";

// 대시보드 - 각 플랫폼 별 지표 집계
export const getOverview = async (
  orgId: number,
  providerType: "KAKAO" | "NAVER" | "GOOGLE",
): Promise<IMetricsResponse> => {
  const { data } = await axiosInstance.get<ICommonResponse<IMetricsResponse>>(
    `/api/dashboard/${orgId}/metrics`,
    {
      params: { providerType },
    },
  );
  return data.data;
};
