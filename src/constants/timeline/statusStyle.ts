import type { TTimelinePerformanceStatus } from "@/types/timeline/api";

export interface ITimelinePerformanceStatusStyle {
  label: string;
  description: string;
  barBg: string;
  accent: string;
  dot: string;
}

export const TIMELINE_PERFORMANCE_STATUS_STYLE: Record<
  TTimelinePerformanceStatus,
  ITimelinePerformanceStatusStyle
> = {
  ON_TRACK: {
    label: "On Track",
    description: "최근 추세와 비슷한 수준의 성과를 유지하고 있어요.",
    barBg: "bg-primary-400/12",
    accent: "bg-primary-400",
    dot: "bg-primary-400",
  },
  ABOVE_AVERAGE: {
    label: "Above Avg",
    description: "최근 평균 대비 눈에 띄게 좋은 성과를 보이고 있어요.",
    barBg: "bg-oauth-naver/12",
    accent: "bg-oauth-naver",
    dot: "bg-oauth-naver",
  },
  AT_RISK: {
    label: "At Risk",
    description: "최근 평균 대비 성과가 눈에 띄게 낮아요.",
    barBg: "bg-info-red/10",
    accent: "bg-info-red",
    dot: "bg-info-red",
  },
};
