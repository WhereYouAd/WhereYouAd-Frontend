import { lazy, Suspense } from "react";
import type { ApexOptions } from "apexcharts";

import Card from "@/components/common/card/Card";
import ChartLegend from "@/components/common/chart/ChartLegend";

const ReactApexChart = lazy(() => import("react-apexcharts"));

const splitIndex = 12;
const clicks = [
  29600, 31100, 31600, 32100, 33600, 37100, 44600, 46100, 46600, 45600, 49600,
  52600, 53600, 51600, 47600, 45600, 43600, 42600, 45100, 40600, 37600, 35600,
  41600, 47600, 50600,
];
const peak = Math.max(...clicks);
const targetPeak = 48500;
const normalizedClicks = clicks.map((value) =>
  Math.round((value / peak) * targetPeak),
);

const actualSeries = normalizedClicks.map((y, i) =>
  i <= splitIndex ? { x: i, y } : { x: i, y: null },
);
const projectedSeries = normalizedClicks.map((y, i) =>
  i >= splitIndex ? { x: i, y } : { x: i, y: null },
);

const options: ApexOptions = {
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
        x: splitIndex,
        borderColor: "var(--color-brand-500)",
        strokeDashArray: 0,
      },
    ],
    points: [
      {
        x: splitIndex,
        y: normalizedClicks[splitIndex],
        marker: {
          size: 5,
          fillColor: "var(--color-logo-2)",
          strokeColor: "var(--color-logo-2)",
        },
      },
    ],
  },
};

const series = [
  { name: "클릭수", data: actualSeries },
  { name: "예측 클릭수", data: projectedSeries },
];

export default function GuideOverviewChart() {
  return (
    <div className="w-full h-[420px] md:h-[500px] bg-transparent">
      <Card
        className="h-full flex flex-col"
        title="실시간 트래픽 변화"
        description={
          <ChartLegend
            items={[
              { label: "클릭수", colorClass: "bg-logo-2" },
              { label: "예측 클릭수", colorClass: "bg-brand-500" },
            ]}
          />
        }
      >
        <p className="sr-only">
          {"실시간 트래픽 변화 차트(목업). 클릭수와 예측 클릭수를 시간 흐름에 따라 비교합니다. " +
            "오후 12시 기준 클릭수 48,500, 전시간 대비 +1.9%로 표시됩니다."}
        </p>
        <Suspense
          fallback={
            <div className="flex-1 w-full rounded-component-md bg-brand-300/50" />
          }
        >
          <div className="relative flex-1 pt-12">
            <div className="absolute right-2 top-0 z-20 rounded-component-md border border-chart-inactive/80 bg-white/95 px-4 py-3 shadow-sm">
              <p className="text-[12px] font-semibold text-text-main">
                광고 클릭수 추이
              </p>
              <p className="mt-1 text-[11px] text-text-auth-sub">
                오후 12시 기준 클릭수 48,500
              </p>
              <p className="mt-0.5 text-[11px] text-text-auth-sub">
                전시간 대비 +1.9%
              </p>
            </div>
            <ReactApexChart
              type="line"
              options={options}
              series={series}
              height="100%"
            />
          </div>
        </Suspense>
      </Card>
    </div>
  );
}
