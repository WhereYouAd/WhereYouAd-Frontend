import type { ICommonResponse } from "@/types/common/common";
import type {
  IBudgetsResponse,
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

// 대시보드 - 예산 집계 API
export const getBudget = async (
  orgId: number,
  providerType?: TProviderType,
): Promise<IBudgetsResponse> => {
  const { data } = await axiosInstance.get<ICommonResponse<IBudgetsResponse>>(
    `/api/dashboard/budgets`,
    { params: { orgId, ...(providerType ? { providerType } : {}) } },
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

// 더미 클릭 데이터 생성 토글 (테스트용)
export const toggleDummyClicks = async (): Promise<void> => {
  await axiosInstance.post("/api/clicks/dummy/toggle");
};
