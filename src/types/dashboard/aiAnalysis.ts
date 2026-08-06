import type { TAiAnalysisProvider, TProviderType } from "./provider";

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

/** GET /organizations/{orgId}/reports 조회 파라미터 */
export interface IAiReportListParams {
  /** 생략하면 전체 유형 조회 */
  reportType?: TProviderType;
  cursor?: string;
  size?: number;
}

/** 리포트 목록 항목 (분석 결과 본문 제외) */
export interface IAiReportListItem {
  reportId: number;
  reportAccessToken: string;
  title: string;
  status: TAiReportJobStatus;
  isShared: boolean;
  createdAt: string;
}

/** GET /organizations/{orgId}/reports 응답 data */
export interface IAiReportListResponse {
  hasNext: boolean;
  nextCursor: string | null;
  reports: IAiReportListItem[];
}
