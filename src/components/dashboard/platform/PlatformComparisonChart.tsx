import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

import { platformComparisonMock } from "./platformComparison.mock";

import googleWordmarkUrl from "@/assets/icon/ads/google-wordmark.svg?url";
import kakaoWordmarkUrl from "@/assets/icon/ads/kakao-wordmark.svg?url";
import naverWordmarkUrl from "@/assets/icon/ads/naver-wordmark.svg?url";

const PLATFORM_WORDMARKS = [
  { name: "Google", src: googleWordmarkUrl, height: 20 },
  { name: "NAVER", src: naverWordmarkUrl, height: 13 },
  { name: "kakao", src: kakaoWordmarkUrl, height: 16 },
];

const LEGEND_ITEMS = [
  { label: "클릭률", color: "#0084fe" },
  { label: "전환률", color: "#22c55e" },
  { label: "노출수", color: "#4b5563" },
];

const options: ApexOptions = {
  chart: {
    type: "bar",
    toolbar: { show: false },
    fontFamily: "Pretendard",
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      borderRadius: 3,
    },
  },
  dataLabels: { enabled: false },
  colors: ["#0084fe", "#22c55e", "#4b5563"],
  stroke: { show: true, width: 2, colors: ["transparent"] },
  xaxis: {
    categories: platformComparisonMock.map((p) => p.name),
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { show: false },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 4,
    labels: {
      formatter: (val: number) => `${val}%`,
      style: { colors: "#8b8b8f", fontSize: "12px" },
    },
  },
  fill: { opacity: 1 },
  grid: {
    borderColor: "#f2f4f6",
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { left: 8, right: 8 },
  },
  legend: { show: false },
  tooltip: {
    y: { formatter: (val: number) => `${val}%` },
    style: { fontFamily: "Pretendard" },
  },
};

const series = [
  { name: "클릭률", data: platformComparisonMock.map((p) => p.clickRate) },
  { name: "전환률", data: platformComparisonMock.map((p) => p.conversionRate) },
  { name: "노출수", data: platformComparisonMock.map((p) => p.impressionRate) },
];

export default function PlatformComparisonChart() {
  return (
    <div>
      <h4 className="font-body1 text-text-main">플랫폼 순위</h4>
      <div className="flex items-center gap-4 mt-1.5">
        {LEGEND_ITEMS.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: color }}
            />
            <span className="font-caption text-text-sub">{label}</span>
          </div>
        ))}
      </div>
      <ReactApexChart
        type="bar"
        options={options}
        series={series}
        height={230}
      />
      <div
        className="-mt-4 grid grid-cols-3"
        style={{ paddingLeft: "48px", paddingRight: "8px" }}
      >
        {PLATFORM_WORDMARKS.map(({ name, src, height }) => (
          <div key={name} className="flex justify-center">
            <img
              src={src}
              alt={name}
              style={{ height: `${height}px`, width: "auto" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
