import type {
  ITimelineDailyTrend,
  TTimelineMetric,
} from "@/types/timeline/api";

/*dailyTrend 행들을 metric별로 하나의 숫자로 합치기
- 카운트(CLICK, CONVERSION, IMPRESSION)는 평균
- ROAS는 일별 roas 산술 평균*/

export function aggregateTimelineMetric(
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

export function mergeDailyTrendRows(
  rows: ITimelineDailyTrend[],
  bucketDateIso: string,
): ITimelineDailyTrend | null {
  if (rows.length === 0) return null;
  return {
    date: bucketDateIso,
    clicks: aggregateTimelineMetric(rows, "CLICK"),
    conversions: aggregateTimelineMetric(rows, "CONVERSION"),
    impressions: aggregateTimelineMetric(rows, "IMPRESSION"),
    roas: aggregateTimelineMetric(rows, "ROAS"),
  };
}
