import type { ApexOptions } from "apexcharts";

import {
  downloadChartCsv,
  downloadChartPng,
  downloadChartSvg,
} from "@/utils/download";

// 차트 고유 ID
export const CHART_ID = "traffic-chart";

// 파일 저장 시 이름에 포함
const TODAY = new Date().toISOString().slice(0, 10);

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

// 차트 옵션 생성
export function buildChartOptions(params: {
  categories: string[];
  maxCount: number;
  anomalyCategory?: string; // 이상 징후 x 좌표 ("HH:mm")
  anomalyY?: number; // 이상 징후 y 좌표
}): ApexOptions {
  const { categories, maxCount, anomalyCategory, anomalyY } = params;
  const yMax = maxCount > 0 ? Math.ceil(maxCount / 10000) * 10000 : 10000;

  return {
    chart: {
      id: CHART_ID,
      type: "area",
      events: {
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
      animations: { enabled: false },
      redrawOnWindowResize: false,
    },

    dataLabels: { enabled: false },

    stroke: {
      curve: "smooth",
      width: 1.5,
    },

    fill: {
      type: "solid",
      opacity: 0.1,
    },

    colors: ["#0084fe"],

    markers: { size: 0 },

    annotations: {
      points:
        anomalyCategory !== undefined && anomalyY !== undefined
          ? [
              {
                x: anomalyCategory,
                y: anomalyY,
                marker: {
                  size: 3,
                  fillColor: "#ff4560",
                  strokeColor: "#ff4560",
                  strokeWidth: 1,
                },
              },
            ]
          : [],
    },

    xaxis: {
      type: "category",
      categories,
      tickAmount: 6,
      labels: {
        formatter: (val: string) => val,
        style: { colors: "#8b8b8f", fontSize: "12px" },
        rotate: 0,
        rotateAlways: false,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },

    yaxis: {
      min: 0,
      max: yMax,
      tickAmount: 6,
      labels: {
        formatter: (val: number) =>
          val === 0 ? "" : `${(val / 1000).toFixed(0)}K`,
        style: { colors: "#8b8b8f", fontSize: "12px" },
      },
    },

    grid: {
      borderColor: "#f2f4f6",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { left: 16, right: 8 },
    },

    tooltip: {
      x: { show: false },
      style: { fontFamily: "Pretendard" },
    },
  };
}
