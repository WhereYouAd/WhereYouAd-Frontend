import type { ApexOptions } from "apexcharts";

import { METRIC_REGISTRY as M } from "@/utils/dashboard/metricRegistry";

export const getMixedChartOptions = (
  categories: string[],
  { compact = false }: { compact?: boolean } = {},
): ApexOptions => ({
  chart: {
    type: "line",
    toolbar: { show: false },
    fontFamily: "Pretendard",
    zoom: { enabled: false },
    selection: { enabled: false },
  },
  stroke: {
    show: true,
    width: [0, 0, 0.01],
  },
  markers: {
    size: [0, 0, 6], // 막대 = 0, 점 = 6
    strokeWidth: 2,
    strokeColors: "var(--color-surface-100)",
    hover: { sizeOffset: 2 },
  },
  plotOptions: {
    bar: {
      columnWidth: "60%",
      borderRadius: 4,
      borderRadiusApplication: "end",
    },
  },
  colors: [
    "var(--color-info-blue)",
    "var(--color-primary-500)",
    "var(--color-primary-300)",
  ],
  xaxis: {
    categories: categories,
    labels: {
      hideOverlappingLabels: !compact,
      style: {
        fontSize: "14px",
        fontWeight: 500,
        colors: "var(--color-text-title)",
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: [
    {
      seriesName: M.ctr.label,
      show: !compact,
      labels: {
        formatter: (val) => M.ctr.format(val),
        style: {
          colors: "var(--color-text-muted)",
          fontSize: "12px",
        },
      },
    },
    {
      seriesName: M.ctr.label,
      show: false,
    },
    {
      opposite: true,
      seriesName: M.impressions.label,
      show: !compact,
      labels: {
        offsetX: -10,
        formatter: (val) => M.impressions.format(val),
        style: {
          colors: "var(--color-text-muted)",
          fontSize: "12px",
        },
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (val, { seriesIndex }) => {
        if (seriesIndex === 0) {
          return M.ctr.format(val);
        }
        if (seriesIndex === 1) {
          return M.conversion.format(val);
        }
        return M.impressions.format(val);
      },
    },
  },
  grid: {
    borderColor: "var(--color-surface-200)",
    yaxis: { lines: { show: true } },
    padding: compact
      ? { bottom: 4, top: 0, left: 4, right: 4 }
      : { bottom: -15, top: -15 },
  },
  legend: { show: false },
});
