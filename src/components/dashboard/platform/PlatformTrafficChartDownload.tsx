import { DropdownMenu } from "@/components/common/dropdownmenu/DropdownMenu";
import {
  getPlatformAllTrafficFilename,
  getPlatformTrafficFilename,
  getTrafficChartDownloadItems,
  PLATFORM_ALL_TRAFFIC_CHART_ID,
  PLATFORM_ALL_TRAFFIC_CONTAINER_ID,
  PLATFORM_TRAFFIC_CHART_ID,
  PLATFORM_TRAFFIC_CONTAINER_ID,
} from "@/components/dashboard/platform/platformTrafficChartDownload.config";

import MoreIcon from "@/assets/icon/common/more.svg?react";

type TPlatformTrafficChartDownloadProps = {
  /** 개별 보기: 플랫폼 코드 (GOOGLE 등). 없으면 전체보기 */
  platform?: string;
};

export default function PlatformTrafficChartDownload({
  platform,
}: TPlatformTrafficChartDownloadProps) {
  const chartId = platform
    ? PLATFORM_TRAFFIC_CHART_ID
    : PLATFORM_ALL_TRAFFIC_CHART_ID;
  const containerId = platform
    ? PLATFORM_TRAFFIC_CONTAINER_ID
    : PLATFORM_ALL_TRAFFIC_CONTAINER_ID;
  const filename = platform
    ? getPlatformTrafficFilename(platform)
    : getPlatformAllTrafficFilename();

  return (
    <DropdownMenu
      aria-label="차트 다운로드"
      trigger={
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded hover:bg-surface-200 transition-ui-fast"
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
      items={getTrafficChartDownloadItems(chartId, containerId, filename)}
    />
  );
}
