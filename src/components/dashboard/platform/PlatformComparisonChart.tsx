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

// Y축 레이블 영역 고정 너비 — wordmark 정렬의 단일 기준값
const YAXIS_LABEL_WIDTH = 42;

const LEGEND_ITEMS = [
  { label: "클릭률", color: "#0084fe" },
  { label: "전환률", color: "#22c55e" },
  { label: "노출수", color: "#CBD5E1" },
];

const options: ApexOptions = {
  chart: {
    type: "bar",
    toolbar: { show: false },
    fontFamily: "Pretendard",
    animations: {
      enabled: true,
      speed: 800,
      dynamicAnimation: { enabled: true, speed: 350 },
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "75%",
      borderRadius: 8,
      borderRadiusApplication: "end",
    },
  },
  dataLabels: { enabled: false },
  colors: ["#0084fe", "#22c55e", "#CBD5E1"],
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
      minWidth: YAXIS_LABEL_WIDTH,
      maxWidth: YAXIS_LABEL_WIDTH,
      formatter: (val: number) => `${val}%`,
      style: { colors: "#b0b8c1", fontSize: "11px", fontWeight: 500 },
    },
  },
  fill: { opacity: 1 },
  grid: {
    borderColor: "#F2F4F6",
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { left: 0, right: 0, top: -10 },
  },
  legend: { show: false },
  tooltip: {
    shared: true,
    intersect: false,
    y: { formatter: (val: number) => `${val}%` },
    style: { fontFamily: "Pretendard" },
    theme: "light",
  },
  states: {
    hover: {
      filter: { type: "none" },
    },
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
      <div className="flex flex-col gap-1 mb-4">
        <h4 className="font-body2 text-text-main font-extrabold tracking-tight">
          플랫폼 순위
        </h4>
        <div className="flex items-center gap-3">
          {LEGEND_ITEMS.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: color }}
              />
              <span className="font-caption font-bold text-text-sub">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-55" style={{ willChange: "transform" }}>
        <ReactApexChart
          type="bar"
          options={options}
          series={series}
          height="100%"
        />
      </div>

      <div
        className="grid grid-cols-3 pt-2"
        style={{ paddingLeft: `${YAXIS_LABEL_WIDTH}px` }}
      >
        {PLATFORM_WORDMARKS.map(({ name, src, height }) => (
          <div
            key={name}
            className="flex justify-center items-center opacity-80 group-hover:opacity-100 transition-opacity"
          >
            <img
              src={src}
              alt={name}
              style={{
                height: `${height}px`,
                width: "auto",
                filter: "grayscale(0.2)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
