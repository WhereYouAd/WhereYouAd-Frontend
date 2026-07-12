import type {
  ITimelineDailyTrend,
  ITimelineDetail,
  TTimelineMetric,
} from "@/types/timeline/api";
import type { ITimelineSummaryPanelData } from "@/types/timeline/summary";
import { TIMELINE_METRIC_OPTIONS } from "@/constants/timeline/formOptions";
import { resolveTimelinePerformanceStatus } from "@/constants/timeline/statusStyle";

import { formatDot } from "./period";

/** dailyTrend 배열에서 metric별 집계값 계산 */
function aggregateMetric(
  dailyTrend: ITimelineDailyTrend[],
  metric: TTimelineMetric,
): number {
  if (dailyTrend.length === 0) return 0;

  switch (metric) {
    case "CLICK":
      return dailyTrend.reduce((sum, row) => sum + row.clicks, 0);
    case "CONVERSION":
      return dailyTrend.reduce((sum, row) => sum + row.conversions, 0);
    case "IMPRESSION":
      return dailyTrend.reduce((sum, row) => sum + row.impressions, 0);
    case "ROAS": {
      const total = dailyTrend.reduce((sum, row) => sum + row.roas, 0);
      return total / dailyTrend.length;
    }
    default:
      return 0;
  }
}

/** 상세 API → 성과 패널 props */
export function buildTimelineSummaryPanel(
  detail: ITimelineDetail,
): ITimelineSummaryPanelData {
  const metrics = detail.metrics.map((metricKey) => {
    const label =
      TIMELINE_METRIC_OPTIONS.find((option) => option.value === metricKey)
        ?.label ?? metricKey;

    const value = aggregateMetric(detail.dailyTrend, metricKey);

    return {
      metric: metricKey,
      label,
      value,
      unit: metricKey === "ROAS" ? "배" : undefined,
      // changeRate: API에 없음 → 패널에서 % 변화 없으면 숨김 처리됨
    };
  });

  return {
    timelineName: detail.name,
    periodLabel: `${formatDot(detail.startDate)} ~ ${formatDot(detail.endDate)}`,
    performanceStatus: resolveTimelinePerformanceStatus(
      detail.performanceStatus,
    ),
    aiSummary: detail.summary ?? "",
    metrics,
    platformShare: detail.platformContributions.map((item) => ({
      provider: item.platform,
      contributionRate: item.contributionRate,
    })),
    dailyTrend: detail.dailyTrend,
    startDate: detail.startDate,
    endDate: detail.endDate,
  };
}
