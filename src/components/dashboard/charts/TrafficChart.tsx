import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

import { trafficChartMock } from "./trafficChart.mock";

const { labels, clicks } = trafficChartMock;

// x축 시간대
const LABEL_HOURS = new Set(["00:00", "06:00", "12:00", "18:00", "24:00"]);

const yAxisMax = Math.ceil(Math.max(...clicks) / 10000) * 10000;

const options: ApexOptions = {
  chart: {
    type: "area",
    toolbar: { show: false }, // 우측 상단 툴바 표시 안함
    zoom: { enabled: false },
    fontFamily: "Pretendard",
    animations: { enabled: true, dynamicAnimation: { enabled: false } },
  },
  dataLabels: { enabled: false }, // 각 포인트 위 숫자 레이블 숨김
  stroke: { curve: "monotoneCubic", width: 1.5 },
  // 라인 아래 그라데이션
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.5,
      stops: [0, 90, 100],
    },
  },
  colors: ["#0084fe"], // --color-status-blue
  markers: { size: 0 }, // 데이터 포인트 마커 숨김
  xaxis: {
    type: "category",
    categories: labels, // 00:00 ~ 24:00
    tickAmount: 24, // 1시간 간격 tick 생성
    labels: {
      // LABEL_HOURS에 해당하는 시간대만 표시, 나머지는 빈 문자열
      formatter: (val: string) => (LABEL_HOURS.has(val) ? val : ""),
      style: { colors: "#8b8b8f", fontSize: "12px" }, // --color-text-sub
      rotate: 0, // 레이블 수평 고정
      rotateAlways: false, // 자동 회전 방지
    },
    axisBorder: { show: false }, // x축 하단 경계선 숨김
    axisTicks: { show: false }, // tick 눈금 숨김
    tooltip: { enabled: false }, // 호버 시 x축 tooltip 숨김
  },
  yaxis: {
    min: 0,
    max: yAxisMax, // 데이터 기반 동적 최대값
    tickAmount: 6, // 1만 단위 눈금
    labels: {
      // 0은 숨기고, 나머지는 K 단위로 변환
      formatter: (val: number) =>
        val === 0 ? "" : `${(val / 1000).toFixed(0)}K`,
      style: { colors: "#8b8b8f", fontSize: "12px" }, // --color-text-sub
    },
  },
  grid: {
    borderColor: "#f2f4f6", // --color-chart-inactive
    xaxis: { lines: { show: false } }, // 세로 그리드선 숨김
    yaxis: { lines: { show: true } }, // 가로 그리드선 표시
    padding: { left: 16, right: 8 }, // y축 레이블와 차트 사이 여백 줌
  },
  tooltip: {
    x: { show: false }, // 상단 시간 헤더 숨김
    y: {
      title: { formatter: () => "클릭수: " }, // 시리즈 이름 대신 고정 텍스트
      formatter: (val: number) => val.toLocaleString(), // 쉼표 포맷
    },
    style: { fontFamily: "Pretendard" }, // 폰트 통일
  },
};

const series = [
  {
    name: "클릭수",
    data: labels.map((label, i) => ({ x: label, y: clicks[i] })),
  },
];

export default function TrafficChart() {
  return (
    <ReactApexChart
      type="area"
      options={options}
      series={series}
      height={360}
    />
  );
}
