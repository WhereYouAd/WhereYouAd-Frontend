import { type MouseEvent, useCallback, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";

import { useIsMounted } from "@/hooks/common/useIsMounted";

import { DropdownMenu } from "@/components/common/dropdownmenu/DropdownMenu";

import {
  BASE_OPTIONS,
  CHART_CONTAINER_ID,
  DOWNLOAD_ITEMS,
} from "./trafficChart.config";
import { trafficChartMock } from "./trafficChart.mock";
import { useAnomalyMarkerPos } from "./useAnomalyMarkerPos";

import MoreIcon from "@/assets/icon/ai-report/more.svg?react";

// 차트 우측 상단 다운로드 버튼
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

// 이상 징후 커스텀 말풍선 툴팁
function AnomalyBubble({ x, y }: { x: number; y: number }) {
  const GAP = 16;
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y - GAP,
        transform: "translateX(-50%) translateY(-100%)",
      }}
    >
      <div className="relative bg-white border-2 border-status-red rounded-2xl px-5 py-3 text-center min-w-37">
        <p className="text-status-red font-bold text-sm leading-snug">
          클릭 이상 징후 감지
        </p>
        <p className="text-[#555] text-xs mt-1 leading-relaxed">
          구글-캠페인 A-광고 1
          <br />
          부정 클릭 의심
        </p>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.75 w-3 h-3 bg-white border-r-2 border-b-2 border-[#ff4560] rotate-45" />
      </div>
    </div>
  );
}

// 이상 징후 빨간 점 근접 판정 반경 (px)
const HOVER_RADIUS = 24;

export default function TrafficChart() {
  const isMounted = useIsMounted();
  const containerRef = useRef<HTMLDivElement>(null);

  // 빨간 점의 컨테이너 기준 좌표
  const markerPos = useAnomalyMarkerPos(containerRef);
  // 마우스가 빨간 점 근처에 있는지 여부
  const [isAnomalyHovered, setIsAnomalyHovered] = useState(false);

  // 마우스 위치와 빨간 점의 거리로 호버 여부 판정
  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!markerPos || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const dist = Math.sqrt((mx - markerPos.x) ** 2 + (my - markerPos.y) ** 2);
      setIsAnomalyHovered(dist <= HOVER_RADIUS);
    },
    [markerPos, containerRef],
  );

  const handleMouseLeave = useCallback(() => setIsAnomalyHovered(false), []);

  return (
    <div
      id={CHART_CONTAINER_ID}
      ref={containerRef}
      role="img"
      aria-label="실시간 트래픽 변화 차트: 시간대별 클릭수 추이"
      data-hide-tooltip={isAnomalyHovered || undefined}
      className="relative [&_.apexcharts-toolbar]:hidden [&[data-hide-tooltip]_.apexcharts-tooltip]:invisible [&[data-hide-tooltip]_.apexcharts-tooltip]:pointer-events-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {isMounted && (
        <ReactApexChart
          type="area"
          options={BASE_OPTIONS}
          series={[
            {
              name: "클릭수",
              data: trafficChartMock.clicks.map((y, i) => ({ x: i, y })),
            },
          ]}
          height={400}
        />
      )}
      {markerPos && isAnomalyHovered && (
        <AnomalyBubble x={markerPos.x} y={markerPos.y} />
      )}
    </div>
  );
}
