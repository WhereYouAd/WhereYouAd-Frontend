import type { ApexOptions } from "apexcharts";

import {
  downloadChartCsv,
  downloadChartPng,
  downloadChartSvg,
} from "@/utils/download";

import { trafficChartMock } from "./trafficChart.mock";

// 차트 인스턴스를 식별하는 고유 ID
export const CHART_ID = "traffic-chart";

// 이상 징후 데이터 포인트 인덱스 (x: 11)
export const ANOMALY_INDEX = 11;

// 파일 저장 시 날짜를 자동으로 포함시키기 위해 상수로 관리
const TODAY = new Date().toISOString().slice(0, 10);

// x축에 시간 레이블을 실제로 렌더링할 시간 목록.
const LABEL_HOURS = new Set([0, 6, 12, 18, 24]);

// ApexCharts에 전달되는 기본 옵션 객체
export const BASE_OPTIONS: ApexOptions = {
  chart: {
    // ApexCharts 인스턴스를 식별하는 ID
    id: CHART_ID,
    type: "area",
    events: {
      // ApexCharts가 SVG 내부에 자동으로 삽입하는 <title> 요소를 제거
      mounted: (chartContext: { el: Element }) => {
        chartContext.el.querySelector("svg > title")?.remove();
      },
    },

    toolbar: {
      // 툴바 자체는 렌더링하지만 기본 제공 버튼들은 모두 숨김
      show: true,
      tools: {
        download: false, // 다운로드 아이콘 숨김
        selection: false, // 범위 선택 도구 숨김
        zoom: false, // 줌 도구 숨김
        zoomin: false, // 줌인 버튼 숨김
        zoomout: false, // 줌아웃 버튼 숨김
        pan: false, // 팬(이동) 도구 숨김
        reset: false, // 줌 리셋 버튼 숨김
      },
      export: {
        // CSV 다운로드 시 파일 헤더와 구분자 설정.
        csv: {
          filename: `overview-traffic-data-${TODAY}`,
          columnDelimiter: ",",
          headerCategory: "시간",
          headerValue: "클릭수",
        },
      },
    },

    // 마우스 휠 또는 드래그 줌 비활성화
    zoom: { enabled: false },

    // 차트 전체에 적용되는 폰트
    fontFamily: "Pretendard",

    animations: {
      // 초기 렌더링 시 라인 그려지는 애니메이션 활성화
      enabled: true,
      // 데이터 업데이트 시 동적 애니메이션은 비활성화
      dynamicAnimation: { enabled: false },
    },
  },

  // 각 데이터 포인트 위에 수치를 직접 표시하는 레이블 숨김
  dataLabels: { enabled: false },

  stroke: {
    // 데이터 포인트 사이를 부드러운 곡선으로 연결
    curve: "monotoneCubic",
    width: 1.5,
  },

  // 라인 아래 영역을 그라데이션
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5, //불투명도
      stops: [0, 90, 100], // 아래쪽으로 갈수록 투명해짐
    },
  },

  colors: ["#0084fe"],

  // 각 데이터 포인트에 원형 마커를 표시하지 않음
  markers: { size: 0 },

  // 차트 위에 겹쳐 그리는 주석
  // 이상 징후로 감지된 특정 시간대·클릭수 위치에 빨간 마커를 표시
  annotations: {
    points: [
      {
        x: 11, // 이상 징후 발생 시각
        y: 53000, // 이상 징후 발생 시점의 클릭수
        marker: {
          size: 5,
          fillColor: "#ff4560",
          strokeColor: "#ff4560",
          strokeWidth: 1,
        },
      },
    ],
  },

  xaxis: {
    type: "numeric",

    // 차트 표시 범위를 0시~24시로 고정
    min: 0,
    max: 24,

    // x축 눈금 개수를 24개로 설정해 1시간 간격으로 눈금 생성
    tickAmount: 24,

    labels: {
      // 0, 6, 12, 18, 24시만 "HH:00" 형식으로 표시(나머지 시간은 빈 문자열 반환)
      // padStart(2, "0")로 한 자리 숫자를 두 자리로 맞춰 정렬을 일관되게 유지
      formatter: (val: string) => {
        const n = Number(val);
        return LABEL_HOURS.has(n) ? `${String(n).padStart(2, "0")}:00` : "";
      },
      style: { colors: "#8b8b8f", fontSize: "12px" },
      // 레이블 수평 고정
      rotate: 0,
      rotateAlways: false,
    },

    // x축 하단의 실선 경계 숨김
    axisBorder: { show: false },

    // 눈금선(tick mark)을 숨김
    axisTicks: { show: false },

    // 데이터 포인트에 마우스를 올렸을 때 x축 아래에 나타나는 기본 툴팁 숨김
    tooltip: { enabled: false },
  },

  yaxis: {
    // y축 최솟값을 0으로 고정 -> 트래픽이 없는 구간도 0 기준선부터 표시
    min: 0,

    // mock 데이터의 최대 클릭수를 1만 단위로 올림해 y축 최댓값을 결정한다.
    max: Math.ceil(Math.max(...trafficChartMock.clicks) / 10000) * 10000,

    // y축 눈금 개수
    tickAmount: 6,

    labels: {
      // 0은 빈 문자열로 숨겨 x축과 겹치는 "0K" 레이블이 표시되지 않도록 한다.
      // 나머지 값은 1,000으로 나눠 "K" 단위로 변환
      formatter: (val: number) =>
        val === 0 ? "" : `${(val / 1000).toFixed(0)}K`,
      style: { colors: "#8b8b8f", fontSize: "12px" },
    },
  },

  grid: {
    borderColor: "#f2f4f6",

    // 세로 그리드선 숨김
    xaxis: { lines: { show: false } },

    // 가로 그리드선 표시
    yaxis: { lines: { show: true } },

    // y축 레이블("10K" 등)과 차트영역 사이 여백
    padding: { left: 16, right: 8 },
  },

  tooltip: {
    custom: ({
      series,
      dataPointIndex,
    }: {
      series: number[][];
      dataPointIndex: number;
    }) => {
      if (dataPointIndex === ANOMALY_INDEX) return "";
      const val = series[0][dataPointIndex];
      if (val === undefined) return "";
      return `<div style="padding:8px 12px;font-family:Pretendard;font-size:13px;background:#1f2937;color:white;border-radius:8px;display:flex;align-items:center;gap:6px"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#0084fe;flex-shrink:0"></span>클릭수:&nbsp;<strong>${(val / 1000).toFixed(0)}K</strong></div>`;
    },
  },
};

// SVG 저장은 DOM에서 직접 SVG 요소를 찾아서 처리하기 때문에
// 차트를 감싸는 HTML 컨테이너 요소의 id 속성을 상수로 관리
export const CHART_CONTAINER_ID = `${CHART_ID}-container`;

// 다운로드 파일의 기본 이름
const FILENAME = `overview-traffic-chart-${TODAY}`;

// 다운로드 드롭다운에 표시할 항목
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
