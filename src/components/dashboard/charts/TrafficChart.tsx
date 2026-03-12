import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

import {
  downloadChartCsv,
  downloadChartPng,
  downloadChartSvg,
} from "@/utils/download";

import { DropdownMenu } from "@/components/common/dropdownmenu/DropdownMenu";

import { trafficChartMock } from "./trafficChart.mock";

import MoreIcon from "@/assets/icon/ai-report/more.svg?react";

const CHART_ID = "traffic-chart";
const TODAY = new Date().toISOString().slice(0, 10);

// x축 표시할 시간 (0~24 숫자)
const LABEL_HOURS = new Set([0, 6, 12, 18, 24]);

const BASE_OPTIONS: ApexOptions = {
  chart: {
    id: CHART_ID,
    type: "area",
    events: {
      mounted: (chartContext: { el: Element }) => {
        chartContext.el.querySelector("svg > title")?.remove();
      },
    },
    toolbar: {
      show: true,
      tools: {
        download: false,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false,
      },
      export: {
        csv: {
          filename: `overview-traffic-data-${TODAY}`,
          columnDelimiter: ",",
          headerCategory: "시간",
          headerValue: "클릭수",
        },
      },
    },
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
      stops: [0, 90, 100],
    },
  },
  colors: ["#0084fe"], // --color-status-blue
  markers: { size: 0 }, // 데이터 포인트 마커 숨김
  // 이상 징후 표시 (tickAmount 제거해야 x 문자열 매칭 동작)
  annotations: {
    points: [
      {
        x: 11,
        y: 53000,
        marker: {
          size: 5,
          fillColor: "#ff4560",
          strokeColor: "#ff4560",
          strokeWidth: 1,
        },
        label: {
          borderColor: "#ff4560",
          style: {
            color: "#ff4560",
            background: "#fff",
            fontSize: "12px",
            fontFamily: "Pretendard",
          },
          text: "이상 클릭 탐지",
          offsetY: -4,
        },
      },
    ],
  },
  xaxis: {
    type: "numeric",
    min: 0,
    max: 24,
    tickAmount: 24,
    labels: {
      // LABEL_HOURS에 해당하는 시간대만 표시, 나머지는 빈 문자열
      formatter: (val: string) => {
        const n = Number(val);
        return LABEL_HOURS.has(n) ? `${String(n).padStart(2, "0")}:00` : "";
      },
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
    max: Math.ceil(Math.max(...trafficChartMock.clicks) / 10000) * 10000,
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
    style: { fontFamily: "Pretendard" },
  },
};

const CHART_CONTAINER_ID = `${CHART_ID}-container`;
const FILENAME = `overview-traffic-chart-${TODAY}`;
const DOWNLOAD_ITEMS = [
  {
    label: "PNG 저장",
    onClick: () => downloadChartPng(CHART_ID, FILENAME),
  },
  {
    label: "SVG 저장",
    onClick: () => downloadChartSvg(CHART_CONTAINER_ID, FILENAME),
  },
  {
    label: "CSV 다운로드",
    onClick: () => downloadChartCsv(CHART_ID),
  },
];

export function TrafficChartDownload() {
  return (
    <DropdownMenu
      aria-label="차트 다운로드"
      trigger={
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-brand-300 transition-fast"
          aria-label="다운로드 메뉴 열기"
        >
          <MoreIcon
            width={16}
            height={16}
            aria-hidden="true"
            className="text-text-auth-sub"
          />
        </button>
      }
      items={DOWNLOAD_ITEMS}
    />
  );
}

export default function TrafficChart() {
  return (
    <div
      id={CHART_CONTAINER_ID}
      role="img"
      aria-label="실시간 트래픽 변화 차트: 시간대별 클릭수 추이"
      className="[&_.apexcharts-toolbar]:hidden"
    >
      <ReactApexChart
        type="area"
        options={BASE_OPTIONS}
        series={[
          {
            name: "클릭수",
            data: trafficChartMock.clicks.map((y, i) => ({ x: i, y })),
          },
        ]}
        height={360}
      />
    </div>
  );
}
