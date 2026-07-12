import {
  TIMELINE_PERFORMANCE_STATUS,
  type TTimelinePerformanceStatus,
} from "@/types/timeline/api";

export interface ITimelinePerformanceStatusStyle {
  label: string;
  description: string;
  legendDescription: string;
  barBg: string;
  accent: string;
  dot: string;
  ring: string;
}

export const TIMELINE_STATUS_LEGEND_ORDER = [
  "ON_TRACK",
  "ABOVE_AVERAGE",
  "AT_RISK",
] as const satisfies readonly TTimelinePerformanceStatus[];

export const TIMELINE_STATUS_BASELINE_HELP =
  "성과 상태는 타임라인에 설정한 비교 기간의 평균 성과를 기준으로, 현재 기간 성과가 어느 수준인지 보여줍니다.";

export const TIMELINE_PERFORMANCE_STATUS_STYLE: Record<
  TTimelinePerformanceStatus,
  ITimelinePerformanceStatusStyle
> = {
  ON_TRACK: {
    label: "On Track",
    description: "최근 추세와 비슷한 수준의 성과를 유지하고 있어요.",
    legendDescription: "성과가 최근 흐름과 유사하게 유지되고 있음",
    barBg: "bg-primary-400/12",
    accent: "bg-primary-400",
    dot: "bg-primary-400",
    ring: "ring-primary-400",
  },
  ABOVE_AVERAGE: {
    label: "Above Avg",
    description: "최근 평균 대비 눈에 띄게 좋은 성과를 보이고 있어요.",
    legendDescription: "최근 평균보다 눈에 띄게 좋은 성과",
    barBg: "bg-oauth-naver/12",
    accent: "bg-oauth-naver",
    dot: "bg-oauth-naver",
    ring: "ring-oauth-naver",
  },
  AT_RISK: {
    label: "Underperform",
    description: "최근 평균 대비 성과가 눈에 띄게 낮아요.",
    legendDescription: "최근 평균 대비 성과가 눈에 띄게 낮음",
    barBg: "bg-info-red/10",
    accent: "bg-info-red",
    dot: "bg-info-red",
    ring: "ring-info-red",
  },
};

/** API가 null/미정의/알 수 없는 값을 줄 때 ON_TRACK으로 정규화 */
export function resolveTimelinePerformanceStatus(
  status: string | null | undefined,
): TTimelinePerformanceStatus {
  if (
    status != null &&
    (TIMELINE_PERFORMANCE_STATUS as readonly string[]).includes(status)
  ) {
    return status as TTimelinePerformanceStatus;
  }
  return "ON_TRACK";
}

/** 성과 상태 → 바/패널 스타일 (미정의 시 기본 스타일) */
export function resolveTimelinePerformanceStatusStyle(
  status: string | null | undefined,
): ITimelinePerformanceStatusStyle {
  return TIMELINE_PERFORMANCE_STATUS_STYLE[
    resolveTimelinePerformanceStatus(status)
  ];
}
