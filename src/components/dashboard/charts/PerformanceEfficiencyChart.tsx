import { lazy, memo, Suspense, useMemo, useSyncExternalStore } from "react";

import type { IPlatformPerformance } from "@/types/dashboard/platform";
import { PLATFORM_MAP } from "@/types/dashboard/provider";

import { METRIC_REGISTRY as M } from "@/utils/dashboard/metricRegistry";

import { getMixedChartOptions } from "./performanceEfficiencyChart.config";

const Chart = lazy(() => import("react-apexcharts"));

const MOBILE_MQ = "(max-width: 639px)";

function subscribeMobile(onStoreChange: () => void) {
  const mq = window.matchMedia(MOBILE_MQ);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getMobileSnapshot() {
  return window.matchMedia(MOBILE_MQ).matches;
}

function getServerMobileSnapshot() {
  return false;
}

export const PerformanceEfficiencyChart = memo(
  ({ data }: { data: IPlatformPerformance[] }) => {
    const isMobile = useSyncExternalStore(
      subscribeMobile,
      getMobileSnapshot,
      getServerMobileSnapshot,
    );

    const categories = useMemo(
      () => data.map((d) => PLATFORM_MAP[d.provider] || d.provider),
      [data],
    );
    const options = useMemo(
      () => getMixedChartOptions(categories, { compact: isMobile }),
      [categories, isMobile],
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

    const chartHeight = isMobile ? 175 : 150;

    return (
      <Suspense fallback={<div className={isMobile ? "h-44" : "h-40"} />}>
        <Chart options={options} series={series} height={chartHeight} />
      </Suspense>
    );
  },
);

export default PerformanceEfficiencyChart;
