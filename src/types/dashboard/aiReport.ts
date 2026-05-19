/** AI 요약 리포트 — 대시보드 공통 */
export interface IAiReportSection {
  title: string;
  content: string;
}

export interface IAiReportKeyMetric {
  label: string;
  value: string;
  detail?: string;
}

export interface IAiReportResponse {
  label: string;
  title: string;
  /* 본문과 중복되지 않는 요약 문장 */
  executiveSummary?: string[];
  /* 핵심 수치 */
  keyMetrics?: IAiReportKeyMetric[];
  strategySuggestion: {
    title: string;
    content: string;
  };
  sections: IAiReportSection[];
  warning: {
    title: string;
    content: string;
  };
}
