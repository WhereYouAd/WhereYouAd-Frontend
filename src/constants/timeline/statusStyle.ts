import {
  TIMELINE_PERFORMANCE_STATUS,
  type TTimelinePerformanceStatus,
  type TTimelinePerformanceStatusUi,
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
  "UNDERPERFORM",
  "PENDING",
] as const satisfies readonly TTimelinePerformanceStatusUi[];

export const TIMELINE_STATUS_BASELINE_HELP =
  "성과 상태는 타임라인에 설정한 비교 기간의 평균 성과를 기준으로, 현재 기간 성과가 어느 수준인지 보여줍니다. 미정은 성과가 아직 산출되지 않은 상태입니다.";

export const TIMELINE_PERFORMANCE_STATUS_STYLE: Record<
  TTimelinePerformanceStatusUi,
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
  UNDERPERFORM: {
    label: "Underperform",
    description: "최근 평균 대비 성과가 눈에 띄게 낮아요.",
    legendDescription: "최근 평균 대비 성과가 눈에 띄게 낮음",
    barBg: "bg-info-red/10",
    accent: "bg-info-red",
    dot: "bg-info-red",
    ring: "ring-info-red",
  },
  PENDING: {
    label: "Pending",
    description: "성과가 아직 산출되지 않았어요.",
    legendDescription: "성과가 아직 산출되지 않음",
    barBg: "bg-surface-300",
    accent: "bg-text-muted",
    dot: "bg-text-muted",
    ring: "ring-text-muted",
  },
};

/** API가 null/미정의/알 수 없는 값을 줄 때 PENDING(미정)으로 정규화 */
export function resolveTimelinePerformanceStatus(
  status: string | null | undefined,
): TTimelinePerformanceStatusUi {
  if (
    status != null &&
    (TIMELINE_PERFORMANCE_STATUS as readonly string[]).includes(status)
  ) {
    return status as TTimelinePerformanceStatus;
  }
  return "PENDING";
}

/** 성과 상태 → 바/패널 스타일 (미정의 시 회색 미정 스타일) */
export function resolveTimelinePerformanceStatusStyle(
  status: string | null | undefined,
): ITimelinePerformanceStatusStyle {
  return TIMELINE_PERFORMANCE_STATUS_STYLE[
    resolveTimelinePerformanceStatus(status)
  ];
}
