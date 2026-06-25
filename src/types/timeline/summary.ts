import type { TProviderType } from "@/types/dashboard/provider";
import type {
  TTimelineMetric,
  TTimelinePerformanceStatus,
} from "@/types/timeline/api";

/*패널 상단 KPI 카드 한개*/
export interface ITimelineSummaryMetric {
  metric: TTimelineMetric;
  label: string; //클릭, 전환 등 UI 라벨
  value: number; //실제 값
  unit?: string; // %, 회
  changeRate?: number; //전기 대비 (-0.05 = -5%)
}

/*플랫폼 기여도*/
export interface ITimelineSummaryPlatformShare {
  provider: TProviderType;
  contributionRate: number; /*기여도*/
}

/*성과 요약 패널 전체*/
export interface ITimelineSummaryPanelData {
  timelineName: string;
  periodLabel: string;
  performanceStatus: TTimelinePerformanceStatus;
  aiSummary: string;
  metrics: ITimelineSummaryMetric[];
  platformShare: ITimelineSummaryPlatformShare[];
}
