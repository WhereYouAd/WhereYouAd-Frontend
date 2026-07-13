import { lazy, memo, Suspense, useMemo } from "react";

import type {
  ITimelineDailyTrend,
  TTimelineMetric,
} from "@/types/timeline/api";

import { buildTimelineChartSeries } from "@/utils/timeline/buildTimelineChartSeries";

import { Skeleton } from "@/components/common/skeleton/Skeleton";

import { buildTimelineDailyTrendChartOptions } from "./timelineDailyTrendChart.config";

const ReactApexChart = lazy(() => import("react-apexcharts"));

interface ITimelineDailyTrendChartProps {
  dailyTrend: ITimelineDailyTrend[];
  metric: TTimelineMetric;
  isLoading?: boolean;
}

const TimelineDailyTrendChart = memo(function TimelineDailyTrendChart({
  dailyTrend,
  metric,
  isLoading = false,
}: ITimelineDailyTrendChartProps) {
  const { series, yMax, xMin, xMax, pointCount } = useMemo(
    () => buildTimelineChartSeries(dailyTrend, metric),
    [dailyTrend, metric],
  );

  const chartOptions = useMemo(
    () =>
      buildTimelineDailyTrendChartOptions({
        metric,
        yMax,
        xMin,
        xMax,
        pointCount,
      }),
    [metric, yMax, xMin, xMax, pointCount],
  );

  if (isLoading) {
    return <Skeleton className="h-48 w-full rounded-2xl" />;
  }

  if (dailyTrend.length === 0) {
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
        />
      </Suspense>
    </div>
  );
});

export default TimelineDailyTrendChart;
