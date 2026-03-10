import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

import { platformComparisonMock } from "./platformComparison.mock";

const YAXIS_LABEL_WIDTH = 42;

const LEGEND_ITEMS = [
  { label: "클릭률", color: "#3B82F6" },
  { label: "전환률", color: "#10B981" },
  { label: "노출수", color: "#E2E8F0" },
];

const options: ApexOptions = {
  chart: {
    type: "bar",
    events: {
      mounted: (chartContext: { el: Element }) => {
        chartContext.el.querySelector("svg > title")?.remove();
      },
    },
    toolbar: { show: false },
    fontFamily: "Pretendard",
    animations: {
      enabled: true,
      speed: 600,
      dynamicAnimation: { enabled: true, speed: 300 },
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      borderRadius: 6,
      borderRadiusApplication: "end",
    },
  },
  dataLabels: { enabled: false },
  colors: ["#3B82F6", "#10B981", "#E2E8F0"],
  stroke: { show: true, width: 3, colors: ["transparent"] },
  xaxis: {
    categories: platformComparisonMock.map((p) => p.name),
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      show: true,
      style: {
        colors: "#9ca3af",
        fontSize: "15px",
        fontWeight: 600,
        fontFamily: "Pretendard",
      },
      offsetY: 6,
    },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 4,
    labels: {
      minWidth: YAXIS_LABEL_WIDTH,
      maxWidth: YAXIS_LABEL_WIDTH,
      formatter: (val: number) => `${val}%`,
      style: { colors: "#9ca3af", fontSize: "12px", fontWeight: 500 },
      offsetX: -5,
    },
  },
  fill: { opacity: 1 },
  grid: {
    borderColor: "#f3f4f6",
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { left: 0, right: 0, top: -10, bottom: 0 },
  },
  legend: { show: false },
  tooltip: {
    shared: true,
    intersect: false,
    y: { formatter: (val: number) => `${val}%` },
    style: { fontFamily: "Pretendard" },
    theme: "light",
  },
};

const series = [
  { name: "클릭률", data: platformComparisonMock.map((p) => p.clickRate) },
  { name: "전환률", data: platformComparisonMock.map((p) => p.conversionRate) },
  { name: "노출수", data: platformComparisonMock.map((p) => p.impressionRate) },
];

export default function PlatformComparisonChart() {
  return (
    <div className="flex flex-col h-full font-pretendard">
      <div className="flex items-center justify-between mb-8">
        <h4 className="font-body2 text-text-main font-extrabold tracking-tight">
          플랫폼 순위
        </h4>
        <div className="flex items-center gap-4">
          {LEGEND_ITEMS.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full shadow-sm"
                style={{ background: color }}
              />
              <span className="font-caption text-text-sub">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-65" style={{ willChange: "transform" }}>
        <ReactApexChart
          type="bar"
          options={options}
          series={series}
          height="100%"
        />
      </div>
    </div>
  );
}
