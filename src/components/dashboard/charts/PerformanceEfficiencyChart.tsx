import { lazy, memo, Suspense, useMemo } from "react";

import type { IPlatformPerformance } from "@/types/dashboard/platform";
import { PLATFORM_MAP } from "@/types/dashboard/provider";

import { METRIC_REGISTRY as M } from "@/utils/dashboard/metricRegistry";

import { getMixedChartOptions } from "./performanceEfficiencyChart.config";

const Chart = lazy(() => import("react-apexcharts"));

export const PerformanceEfficiencyChart = memo(
  ({ data }: { data: IPlatformPerformance[] }) => {
    const categories = useMemo(
      () => data.map((d) => PLATFORM_MAP[d.provider] || d.provider),
      [data],
    );
    const options = useMemo(
      () => getMixedChartOptions(categories),
      [categories],
    );

    const series = [
      {
        name: M.ctr.label,
        type: "column",
        data: data.map((d) =>
          d.impressions > 0 ? (d.clicks / d.impressions) * 100 : 0,
        ),
      },
      {
        name: M.conversion.label,
        type: "column",
        data: data.map((d) => d.conversion),
      },
      {
        name: M.impressions.label,
        type: "line",
        data: data.map((d) => d.impressions),
      },
    ];

    return (
      <Suspense fallback={<div className="h-40" />}>
        <Chart options={options} series={series} height={150} />
      </Suspense>
    );
  },
);

export default PerformanceEfficiencyChart;
