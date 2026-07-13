import type { ApexOptions } from "apexcharts";

import type { TTimelineMetric } from "@/types/timeline/api";

import {
  formatCountChartAxis,
  formatCountChartTooltip,
} from "@/utils/dashboard/metricRegistry";

// 차트 고유 ID
export const TIMELINE_DAILY_TREND_CHART_ID = "timeline-daily-trend-chart";

function formatRoasAxis(val: number): string {
  if (val <= 0) return "";
  return `${val.toFixed(1)}`;
}

function formatRoasTooltip(val: number): string {
  return `${val.toFixed(2)}배`;
}

export function buildTimelineDailyTrendChartOptions(params: {
  metric: TTimelineMetric;
  yMax: number;
  categories: string[];
  /** 미전달 시 categories와 동일 */
  tooltipCategories?: string[];
  /** 1점이면 선이 없으므로 마커를 항상 표시 */
  pointCount?: number;
}): ApexOptions {
  const {
    metric,
    yMax,
    categories,
    tooltipCategories = categories,
    pointCount = 0,
  } = params;
  const isRoas = metric === "ROAS";
  const isSinglePoint = pointCount === 1;

  return {
    chart: {
      id: TIMELINE_DAILY_TREND_CHART_ID,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "Pretendard",
      animations: { enabled: true, speed: 600 },
    },
    dataLabels: { enabled: false },

    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [20, 100],
      },
    },
    colors: ["var(--color-primary-400)"],

    markers: {
      size: isSinglePoint ? 5 : 0,
      hover: { size: isSinglePoint ? 7 : 5 },
    },

    xaxis: {
      type: "category",
      categories,
      labels: {
        style: { colors: "var(--color-text-muted)", fontSize: "12px" },
        rotate: 0,
        hideOverlappingLabels: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      min: 0,
      max: yMax,
      tickAmount: 5,
      labels: {
        formatter: isRoas ? formatRoasAxis : formatCountChartAxis,
        style: { colors: "var(--color-text-muted)", fontSize: "12px" },
      },
    },

    grid: {
      borderColor: "var(--color-surface-200)",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { left: 20, right: 16 },
    },

    tooltip: {
      x: {
        formatter: (_val, opts) =>
          tooltipCategories[opts?.dataPointIndex ?? 0] ?? "",
      },
      y: {
        formatter: (val: number) => {
          if (val == null || Number.isNaN(val)) return "데이터 없음";
          return isRoas ? formatRoasTooltip(val) : formatCountChartTooltip(val);
        },
      },
      style: { fontFamily: "Pretendard" },
    },
    legend: { show: false },
  };
}
