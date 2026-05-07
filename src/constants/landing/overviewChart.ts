import type { ApexOptions } from "apexcharts";

const SPLIT_INDEX = 12;
const CLICKS = [
  29600, 31100, 31600, 32100, 33600, 37100, 44600, 46100, 46600, 45600, 49600,
  52600, 53600, 51600, 47600, 45600, 43600, 42600, 45100, 40600, 37600, 35600,
  41600, 47600, 50600,
];

const PEAK = Math.max(...CLICKS);
const TARGET_PEAK = 48500;
const NORMALIZED_CLICKS = CLICKS.map((value) =>
  Math.round((value / PEAK) * TARGET_PEAK),
);

const actualSeries = NORMALIZED_CLICKS.map((y, i) =>
  i <= SPLIT_INDEX ? { x: i, y } : { x: i, y: null },
);
const projectedSeries = NORMALIZED_CLICKS.map((y, i) =>
  i >= SPLIT_INDEX ? { x: i, y } : { x: i, y: null },
);

export const LANDING_OVERVIEW_CHART_OPTIONS: ApexOptions = {
  chart: {
    type: "line",
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: { enabled: false },
    fontFamily: "Pretendard",
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: "smooth",
    width: [3.5, 3.2],
    dashArray: [0, 6],
    lineCap: "round",
  },
  colors: ["var(--color-logo-2)", "var(--color-brand-500)"],
  markers: { size: [0, 0] },
  tooltip: { enabled: false },
  xaxis: {
    type: "numeric",
    min: 0,
    max: 24,
    tickAmount: 24,
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    min: 0,
    max: 50000,
    tickAmount: 6,
    labels: {
      formatter: (val: number) =>
        val === 0 ? "" : `${(val / 1000).toFixed(0)}K`,
      style: { colors: "var(--color-text-sub)", fontSize: "10px" },
      offsetX: -2,
    },
  },
  grid: {
    borderColor: "var(--color-bg-disabled)",
    strokeDashArray: 5,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { left: 12, right: 8 },
  },
  legend: { show: false },
  annotations: {
    xaxis: [
      {
        x: SPLIT_INDEX,
        borderColor: "var(--color-brand-500)",
        strokeDashArray: 0,
      },
    ],
    points: [
      {
        x: SPLIT_INDEX,
        y: NORMALIZED_CLICKS[SPLIT_INDEX],
        marker: {
          size: 5,
          fillColor: "var(--color-logo-2)",
          strokeColor: "var(--color-logo-2)",
        },
      },
    ],
  },
};

export const LANDING_OVERVIEW_CHART_SERIES = [
  { name: "클릭수", data: actualSeries },
  { name: "예측 클릭수", data: projectedSeries },
];
