import type { TAiAnalysisProvider } from "./provider";

export type { TAiAnalysisProvider };
export type TAiReportJobStatus = "PENDING" | "SUCCESS" | "FAILED";

/** POST /analysis 요청 body */
export interface IAnalysisRequest {
  startDate: string;
  endDate: string;
  provider: TAiAnalysisProvider;
}

/** 분석 완료 시 result */
export interface IAnalysisResponse {
  strategySuggestion: string;
  performanceSummary: string;
  analysisReason: string;
  performancePoint: string[];
  cautionPoint: string[];
}

/** GET 응답 data */
export interface IReportStatusResponse {
  accessToken: string;
  status: TAiReportJobStatus;
  result: IAnalysisResponse | null;
}
