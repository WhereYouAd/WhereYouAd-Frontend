import type { ICommonResponse } from "@/types/common/common";
import type {
  IAnalysisRequest,
  IReportStatusResponse,
} from "@/types/dashboard/aiAnalysis";

import { axiosInstance } from "@/lib/axiosInstance";

/** AI 광고 성과 분석 요청  */
export const requestAiAnalysis = async (
  orgId: number,
  body: IAnalysisRequest,
): Promise<string> => {
  const { data } = await axiosInstance.post<ICommonResponse<string>>(
    `/api/ai/organizations/${orgId}/analysis`,
    body,
    {
      validateStatus: (status) =>
        status === 202 || (status >= 200 && status < 300),
    },
  );
  return data.data;
};

/** accessToken으로 분석 결과 조회 (PENDING / SUCCESS / FAILED) */
export const getAiReportByAccessToken = async (
  accessToken: string,
): Promise<IReportStatusResponse> => {
  const { data } = await axiosInstance.get<
    ICommonResponse<IReportStatusResponse>
  >(`/api/ai/reports/${accessToken}`);
  return data.data;
};
