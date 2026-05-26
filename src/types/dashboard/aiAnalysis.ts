/** 분석 대상 플랫폼 (ALL = 통합) */
export type TAiAnalysisProvider = "NAVER" | "META" | "GOOGLE" | "ALL";

/** 리포트 작업 상태 */
export type TAiReportJobStatus = "PENDING" | "SUCCESS" | "FAILED";

/** POST /analysis 요청 body */
export interface IAnalysisRequest {
  startDate: string;
  endDate: string;
  provider: TAiAnalysisProvider;
}

/** 분석 완료 시 result (카드·PDF도 이 구조 그대로 사용) */
export interface IAnalysisResponse {
  strategySuggestion: string;
  performanceSummary: string;
  analysisReason: string;
  performancePoint: string[];
  cautionPoint: string[];
}

/** GET /reports/{accessToken} 응답 data */
export interface IReportStatusResponse {
  accessToken: string;
  status: TAiReportJobStatus;
  result: IAnalysisResponse | null;
}
