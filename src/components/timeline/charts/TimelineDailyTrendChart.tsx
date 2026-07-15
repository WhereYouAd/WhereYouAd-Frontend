import { lazy, memo, Suspense, useMemo } from "react";

import type {
  ITimelineDailyTrend,
  TTimelineMetric,
} from "@/types/timeline/api";
import type { TTimelineViewUnit } from "@/types/timeline/ui";

import { buildTimelineChartSeries } from "@/utils/timeline/buildTimelineChartSeries";
import { fillDailyTrendRange } from "@/utils/timeline/fillDailyTrendRange";

import { Skeleton } from "@/components/common/skeleton/Skeleton";

import { buildTimelineDailyTrendChartOptions } from "./timelineDailyTrendChart.config";

const ReactApexChart = lazy(() => import("react-apexcharts"));

interface ITimelineDailyTrendChartProps {
  dailyTrend: ITimelineDailyTrend[];
  metric: TTimelineMetric;
  viewUnit?: TTimelineViewUnit;
  /** 선택 구간 시작 — 있으면 구간 전체 날짜를 채움 */
  rangeStart?: Date | null;
  /** 선택 구간 끝 */
  rangeEnd?: Date | null;
  isLoading?: boolean;
}

const TimelineDailyTrendChart = memo(function TimelineDailyTrendChart({
  dailyTrend,
  metric,
  viewUnit = "WEEK",
  rangeStart = null,
  rangeEnd = null,
  isLoading = false,
}: ITimelineDailyTrendChartProps) {
  const hasRange = rangeStart != null && rangeEnd != null;

  const filledRows = useMemo(() => {
    if (hasRange) {
      return fillDailyTrendRange(dailyTrend, rangeStart, rangeEnd);
    }
    return dailyTrend;
  }, [dailyTrend, rangeStart, rangeEnd, hasRange]);

  const { series, categories, tooltipCategories, yMax, pointCount } = useMemo(
    () => buildTimelineChartSeries(filledRows, metric, viewUnit),
    [filledRows, metric, viewUnit],
  );

  const chartOptions = useMemo(
    () =>
      buildTimelineDailyTrendChartOptions({
        metric,
        yMax,
        categories,
        tooltipCategories,
        pointCount,
      }),
    [metric, yMax, categories, tooltipCategories, pointCount],
  );

  if (isLoading) {
    return <Skeleton className="h-48 w-full rounded-2xl" />;
  }

  if (!hasRange && (dailyTrend.length === 0 || pointCount === 0)) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-surface-300/70 bg-surface-200/30 px-4 py-6">
        <span className="font-caption text-text-muted">
          표시할 일별 데이터가 없습니다
        </span>
      </div>
    );
  }

  return (
    <div
      aria-label="일별 변화 추이 차트"
      role="img"
      className="w-full [&_.apexcharts-toolbar]:hidden"
    >
      <Suspense fallback={<Skeleton className="h-48 w-full rounded-2xl" />}>
        <ReactApexChart
          type="area"
          options={chartOptions}
          series={series}
          height={192}
          key={`${viewUnit}-${rangeStart?.getTime()} - ${rangeEnd?.getTime()}`}
        />
      </Suspense>
    </div>
  );
});

export default TimelineDailyTrendChart;
