import { lazy, memo, Suspense, useMemo } from "react";

import type { IPlatformPerformance } from "@/types/dashboard/platform";
import { PLATFORM_MAP } from "@/types/dashboard/platform";

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
        name: "클릭률(CTR)",
        type: "column", // 세로 막대
        data: data.map((d) =>
          d.impressions > 0 ? (d.clicks / d.impressions) * 100 : 0,
        ),
      },
      {
        name: "전환율(CVR)",
        type: "column", // 세로 막대
        data: data.map((d) => d.conversion),
      },
      {
        name: "노출수",
        type: "line", // 점
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
