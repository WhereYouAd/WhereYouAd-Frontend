import type { ICommonResponse } from "@/types/common/common";
import type { IAdCountParams, IAdStatusData } from "@/types/dashboard/platform";

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
