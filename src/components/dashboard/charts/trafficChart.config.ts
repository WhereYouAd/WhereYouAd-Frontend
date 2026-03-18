import type { ApexOptions } from "apexcharts";

import {
  downloadChartCsv,
  downloadChartPng,
  downloadChartSvg,
} from "@/utils/download";

import { trafficChartMock } from "./trafficChart.mock";

// 차트 고유 ID
export const CHART_ID = "traffic-chart";

// 이상 징후 포인트 인덱스 (ex.11시)
export const ANOMALY_INDEX = 11;
const ANOMALY_Y = trafficChartMock.clicks[ANOMALY_INDEX];

// 파일 저장 시 이름에 포함
const TODAY = new Date().toISOString().slice(0, 10);

// x축에 표시할 시간 목록
const LABEL_HOURS = new Set([0, 6, 12, 18, 24]);

export const BASE_OPTIONS: ApexOptions = {
  chart: {
    id: CHART_ID,
    type: "area",
    events: {
      // SVG <title> 및 canvas 폴백 텍스트 제거
      mounted: (chartContext: { el: Element }) => {
        chartContext.el.querySelectorAll("title").forEach((el) => {
          el.remove();
        });
        const canvas = chartContext.el.querySelector("canvas");
        if (canvas) canvas.textContent = "";
      },
    },
    toolbar: {
      show: true,
      // 기본 툴바 버튼 모두 숨김
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
    animations: {
      enabled: true,
      dynamicAnimation: { enabled: false }, // 데이터 업데이트 시 애니메이션 비활성화
    },
  },

  dataLabels: { enabled: false },

  stroke: {
    curve: "monotoneCubic", // 부드러운 곡선
    width: 1.5,
  },

  // 라인 아래 단색 채우기
  fill: {
    type: "solid",
    opacity: 0.1,
  },

  colors: ["#0084fe"],

  markers: { size: 0 }, // 기본 마커 숨김

  // 이상 징후 위치에 빨간 점 표시
  annotations: {
    points:
      ANOMALY_Y === undefined
        ? []
        : [
            {
              x: ANOMALY_INDEX,
              y: ANOMALY_Y,
              marker: {
                size: 3,
                fillColor: "#ff4560",
                strokeColor: "#ff4560",
                strokeWidth: 1,
              },
            },
          ],
  },

  xaxis: {
    type: "numeric",
    min: 0,
    max: 24,
    tickAmount: 24, // 1시간 간격
    labels: {
      // 0, 6, 12, 18, 24시만 표시
      formatter: (val: string) => {
        const n = Number(val);
        return LABEL_HOURS.has(n) ? `${String(n).padStart(2, "0")}:00` : "";
      },
      style: { colors: "#8b8b8f", fontSize: "12px" },
      rotate: 0,
      rotateAlways: false,
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false }, // x축 기본 툴팁 숨김
  },

  yaxis: {
    min: 0,
    max: Math.ceil(Math.max(...trafficChartMock.clicks) / 10000) * 10000,
    tickAmount: 6,
    labels: {
      // 0 숨김, 나머지는 K 단위로 표시
      formatter: (val: number) =>
        val === 0 ? "" : `${(val / 1000).toFixed(0)}K`,
      style: { colors: "#8b8b8f", fontSize: "12px" },
    },
  },

  grid: {
    borderColor: "#f2f4f6",
    xaxis: { lines: { show: false } }, // 세로선 숨김
    yaxis: { lines: { show: true } }, // 가로선 표시
    padding: { left: 16, right: 8 },
  },

  tooltip: {
    x: { show: false },
    style: { fontFamily: "Pretendard" },
  },
};

// SVG 다운로드 시 컨테이너 요소를 직접 참조하기 위한 ID
export const CHART_CONTAINER_ID = `${CHART_ID}-container`;

const FILENAME = `overview-traffic-chart-${TODAY}`;

// 다운로드 드롭다운 항목
export const DOWNLOAD_ITEMS = [
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
