import type { ApexOptions } from "apexcharts";

import type { TTimelineMetric } from "@/types/timeline/api";

import {
  formatCountChartAxis,
  formatCountChartTooltip,
} from "@/utils/dashboard/metricRegistry";

// 차트 고유 ID
export const TIMELINE_DAILY_TREND_CHART_ID = "timeline-daily-trend-chart";

function formatDateAxisLabel(ts: number): string {
  const d = new Date(ts);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}/${day}`;
}

function formatRoasAxis(val: number): string {
  if (val <= 0) return "";
  return `${val.toFixed(1)}`;
}

function formatRoasTooltop(val: number): string {
  return `${val.toFixed(2)}배`;
}

export function buildTimelineDailyTrendChartOptions(params: {
  metric: TTimelineMetric;
  yMax: number;
  xMin?: number;
  xMax?: number;
  /** 1점이면 선이 없으므로 마커를 항상 표시 */
  pointCount?: number;
}): ApexOptions {
  const { metric, yMax, xMin, xMax, pointCount = 0 } = params;
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
      // 기본은 선만, 단일 점은 선이 없어 마커를 항상 보이게
      size: isSinglePoint ? 5 : 0,
      hover: { size: isSinglePoint ? 7 : 5 },
    },

    xaxis: {
      type: "numeric",
      min: xMin,
      max: xMax,
      tickAmount: Math.min(6, 4),
      labels: {
        formatter: (val: string | number) => formatDateAxisLabel(Number(val)),
        style: { colors: "var(--color-text-muted)", fontSize: "12px" },
        rotate: 0,
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
      padding: { left: 8, right: 16 },
    },

    tooltip: {
      x: {
        formatter: (val: number) => formatDateAxisLabel(val),
      },
      y: {
        formatter: (val: number) =>
          isRoas ? formatRoasTooltop(val) : formatCountChartTooltip(val),
      },
      style: { fontFamily: "Pretendard" },
    },
    legend: { show: false },
  };
}
