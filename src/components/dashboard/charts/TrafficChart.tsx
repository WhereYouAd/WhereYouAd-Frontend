import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { DropdownMenu } from "@/components/common/dropdownmenu/DropdownMenu";

import {
  BASE_OPTIONS,
  CHART_CONTAINER_ID,
  DOWNLOAD_ITEMS,
} from "./trafficChart.config";
import { trafficChartMock } from "./trafficChart.mock";
import { useAnomalyMarkerPos } from "./useAnomalyMarkerPos";

import MoreIcon from "@/assets/icon/common/more.svg?react";

const ReactApexChart = lazy(() => import("react-apexcharts"));

// 모듈 수준 상수 - 렌더마다 재생성 방지
const series = [
  {
    name: "클릭수",
    data: trafficChartMock.clicks.map((y, i) => ({ x: i, y })),
  },
];

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
const AnomalyBubble = memo(function AnomalyBubble({
  x,
  y,
}: {
  x: number;
  y: number;
}) {
  const GAP = 12;
  return (
    <div
      className="absolute pointer-events-none transition-all duration-200 ease-out"
      style={{
        left: x,
        top: y - GAP,
        transform: "translateX(-50%) translateY(-100%)",
      }}
    >
      <div className="relative bg-white border border-bg-disabled rounded-component-sm px-5 py-4 min-w-40">
        <div className="flex items-center justify-center gap-1.5 mb-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-status-red shrink-0" />
          <p className="text-text-main font-semibold! text-[13px] tracking-tight">
            클릭 이상 징후 감지
          </p>
        </div>
        <div className="text-center">
          <p className="text-[#4E5968] text-[12px] font-medium leading-5">
            구글 · 캠페인 A · 광고 1
          </p>
        </div>
      </div>
    </div>
  );
});

const TrafficChart = memo(function TrafficChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 빨간 점의 컨테이너 기준 좌표
  const markerPos = useAnomalyMarkerPos(containerRef);
  const [isAnomalyHovered, setIsAnomalyHovered] = useState(false);
  const [isAnomalyFocused, setIsAnomalyFocused] = useState(false);

  // 스크롤 중 pointer-events 제거 - setState 대신 DOM 직접 조작으로 리렌더 방지
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      container.style.pointerEvents = "none";
      clearTimeout(timer);
      timer = setTimeout(() => {
        container.style.pointerEvents = "";
      }, 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleFocus = useCallback(() => setIsAnomalyFocused(true), []);
  const handleBlur = useCallback(() => setIsAnomalyFocused(false), []);
  const handlePointerEnter = useCallback(() => setIsAnomalyHovered(true), []);
  const handlePointerLeave = useCallback(() => setIsAnomalyHovered(false), []);

  const showBubble = isAnomalyHovered || isAnomalyFocused;

  return (
    <div
      id={CHART_CONTAINER_ID}
      ref={containerRef}
      role="group"
      aria-label="실시간 트래픽 변화 차트: 시간대별 클릭수 추이"
      data-hide-tooltip={showBubble || undefined}
      className="relative will-change-transform [&_.apexcharts-toolbar]:hidden [&[data-hide-tooltip]_.apexcharts-tooltip]:invisible [&[data-hide-tooltip]_.apexcharts-tooltip]:pointer-events-none"
    >
      <Suspense fallback={<div className="h-100" />}>
        <ReactApexChart
          type="area"
          options={BASE_OPTIONS}
          series={series}
          height={400}
        />
      </Suspense>
      {markerPos && (
        <>
          <button
            type="button"
            className="absolute size-6 -translate-x-1/2 -translate-y-1/2 opacity-0"
            style={{ left: markerPos.x, top: markerPos.y }}
            aria-label="클릭 이상 징후 상세 보기"
            onFocus={handleFocus}
            onBlur={handleBlur}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
          />
          {showBubble && <AnomalyBubble x={markerPos.x} y={markerPos.y} />}
        </>
      )}
    </div>
  );
});

export default TrafficChart;
