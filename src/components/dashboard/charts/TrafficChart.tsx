import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

import { trafficChartMock } from "./trafficChart.mock";

// x축 시간대
const LABEL_HOURS = new Set(["00:00", "06:00", "12:00", "18:00", "24:00"]);

const BASE_OPTIONS: ApexOptions = {
  chart: {
    type: "area",
    // 다운로드 버튼 활성화된 툴바
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false,
      },
      export: {
        csv: {
          filename: "traffic-data",
          columnDelimiter: ",",
          headerCategory: "시간",
          headerValue: "클릭수",
        },
        svg: { filename: "traffic-chart" },
        png: { filename: "traffic-chart" },
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
  xaxis: {
    type: "category",
    categories: trafficChartMock.labels, // 00:00 ~ 24:00
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

// TODO: 실시간 연동 시 useState로 전환
const series = [
  {
    name: "클릭수",
    data: trafficChartMock.labels.map((label, i) => ({
      x: label,
      y: trafficChartMock.clicks[i],
    })),
  },
];

export default function TrafficChart() {
  const options = useMemo<ApexOptions>(() => {
    const values =
      series[0]?.data.map((d: { x: string; y: number }) => d.y) ?? [];
    const yAxisMax =
      values.length > 0
        ? Math.ceil(Math.max(...values) / 10000) * 10000
        : 10000;

    return { ...BASE_OPTIONS, yaxis: { ...BASE_OPTIONS.yaxis, max: yAxisMax } };
  }, [series]);

  return (
    <div role="img" aria-label="실시간 트래픽 변화 차트: 시간대별 클릭수 추이">
      <ReactApexChart
        type="area"
        options={options}
        series={series}
        height={360}
      />
    </div>
  );
}
