import {
  downloadChartCsv,
  downloadChartPng,
  downloadChartSvg,
} from "@/utils/dashboard/downloadChart";

/** 개별 플랫폼 실시간 트래픽 */
export const PLATFORM_TRAFFIC_CHART_ID = "platform-traffic-chart";
export const PLATFORM_TRAFFIC_CONTAINER_ID = `${PLATFORM_TRAFFIC_CHART_ID}-container`;

/** 전체보기 실시간 클릭수 비교 */
export const PLATFORM_ALL_TRAFFIC_CHART_ID = "platform-all-traffic-chart";
export const PLATFORM_ALL_TRAFFIC_CONTAINER_ID = `${PLATFORM_ALL_TRAFFIC_CHART_ID}-container`;

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

/** DropdownMenu items — 통합 DOWNLOAD_ITEMS와 동일 역할 */
export function getTrafficChartDownloadItems(
  chartId: string,
  containerId: string,
  filename: string,
) {
  return [
    {
      label: "PNG 저장",
      onClick: () => downloadChartPng(chartId, filename),
    },
    {
      label: "SVG 저장",
      onClick: () => downloadChartSvg(containerId, filename),
    },
    {
      label: "CSV 다운로드",
      onClick: () => downloadChartCsv(chartId),
    },
  ];
}

export function getPlatformTrafficFilename(platform: string) {
  return `platform-traffic-${platform}-${todayStamp()}`;
}

export function getPlatformAllTrafficFilename() {
  return `platform-all-traffic-${todayStamp()}`;
}
