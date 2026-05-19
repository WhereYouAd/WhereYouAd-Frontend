// 광고 플랫폼 종류
export type TProviderType = "META" | "NAVER" | "GOOGLE";

// 전체 지표 집계 응답
export interface IMetricsResponse {
  clicks: number;
  clickChangeRate: number;
  impressions: number;
  impressionChangeRate: number;
  conversion: number;
  cvrChangeRate: number;
  ROAS: number;
  ROASChangeRate: number;
}

// 예산 집계 응답
export interface IBudgetsResponse {
  providerType: string;
  usagePercentage: number;
  totalBudget: number;
  totalSpend: number;
  remainingBudget: number;
}

// ROAS 순위 조회 요청 파라미터
export interface IRoasRankingsParams {
  startDate?: string;
  endDate?: string;
}

// ROAS 순위 조회 응답
export interface IRoasRankingsResponse {
  startDate: string;
  endDate: string;
  rankings: IRoasRanking[];
}

// ROAS 순위 항목
export interface IRoasRanking {
  rank: number;
  provider: string;
  roas: number;
  diffRate: number | null;
  revenue: number;
  adSpend: number;
}

// 플랫폼별 ROAS 순위 + 지표(CTR/CVR) 통합 항목
export interface IPlatformRankingItem extends IRoasRanking {
  clickRate?: number; // CTR (%)
  ctrDelta?: number; // CTR 전기 대비 증감 (%)
  conversionRate?: number; // CVR (%)
  conversionDelta?: number; // CVR 전기 대비 증감 (%)
}

// AI 요약 리포트 응답
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
  /** 본문과 중복되지 않는 요약 문장 (3~5줄) */
  executiveSummary?: string[];
  /** 핵심 수치 카드 */
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

// 클릭 스트림 데이터 항목
export interface IClickStreamItem {
  timeSeriesData: {
    minute: string; // 'YYYYMMDDHHmm' 형태
    count: number;
  }[];
  mode: "real" | "dummy";
  hasSuspect: boolean;
  suspectDetail: {
    message: string;
    timestamp: string;
  } | null;
}
