import { useCallback, useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";

import { DropdownMenu } from "@/components/common/dropdownmenu/DropdownMenu";

import {
  BASE_OPTIONS,
  CHART_CONTAINER_ID,
  DOWNLOAD_ITEMS,
} from "./trafficChart.config";
import { trafficChartMock } from "./trafficChart.mock";

import MoreIcon from "@/assets/icon/ai-report/more.svg?react";

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
      <div className="relative bg-white border-2 border-[#ff4560] rounded-2xl px-5 py-3 text-center min-w-37">
        <p className="text-[#ff4560] font-bold text-sm leading-snug">
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

export default function TrafficChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [markerPos, setMarkerPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const updateMarkerPos = useCallback(() => {
    if (!containerRef.current) return;
    const marker = containerRef.current.querySelector<SVGCircleElement>(
      ".apexcharts-point-annotation-marker",
    );
    if (!marker) return;

    // SVG 좌표 행렬(getScreenCTM)로 마커 중심의 화면 좌표를 직접 구함
    const svg = containerRef.current.querySelector<SVGSVGElement>("svg");
    if (!svg) return;
    const ctm = marker.getScreenCTM();
    if (!ctm) return;

    const pt = svg.createSVGPoint();
    pt.x = parseFloat(marker.getAttribute("cx") ?? "0");
    pt.y = parseFloat(marker.getAttribute("cy") ?? "0");
    const screenPt = pt.matrixTransform(ctm);

    const containerRect = containerRef.current.getBoundingClientRect();
    setMarkerPos({
      x: screenPt.x - containerRect.left,
      y: screenPt.y - containerRect.top,
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(updateMarkerPos, 300);
    const observer = new ResizeObserver(updateMarkerPos);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [updateMarkerPos]);

  return (
    <div
      id={CHART_CONTAINER_ID}
      ref={containerRef}
      role="img"
      aria-label="실시간 트래픽 변화 차트: 시간대별 클릭수 추이"
      className="relative [&_.apexcharts-toolbar]:hidden"
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
      {markerPos && <AnomalyBubble x={markerPos.x} y={markerPos.y} />}
    </div>
  );
}
