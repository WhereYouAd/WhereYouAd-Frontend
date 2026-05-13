import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useClickStream } from "@/hooks/dashboard/useClickStream";

import { DropdownMenu } from "@/components/common/dropdownmenu/DropdownMenu";
import { Skeleton } from "@/components/common/skeleton/Skeleton";

import {
  buildChartOptions,
  CHART_CONTAINER_ID,
  DOWNLOAD_ITEMS,
} from "./trafficChart.config";
import { useAnomalyMarkerPos } from "./useAnomalyMarkerPos";

import { toggleDummyClicks } from "@/api/dashboard/overview";
import MoreIcon from "@/assets/icon/common/more.svg?react";

const ReactApexChart = lazy(() => import("react-apexcharts"));

// 차트 우측 상단 다운로드 버튼 + 더미 토글
export function TrafficChartDownload() {
  return (
    <div className="flex flex-col items-end gap-1">
      <DropdownMenu
        aria-label="차트 다운로드"
        trigger={
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-brand-300 transition-ui-fast"
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
      <button
        type="button"
        onClick={toggleDummyClicks}
        className="shrink-0 px-1.5 py-0.5 text-[10px] leading-tight font-medium text-text-placeholder rounded border border-bg-disabled/50 hover:bg-bg-surface transition-colors"
      >
        더미 토글
      </button>
    </div>
  );
}

// 이상 징후 커스텀 툴팁
const AnomalyBubble = memo(function AnomalyBubble({
  x,
  y,
  message,
  timestamp,
}: {
  x: number;
  y: number;
  message?: string;
  timestamp?: string;
}) {
  const GAP = 12;
  return (
    <div
      className="absolute pointer-events-none transition-transform duration-200 ease-out"
      style={{
        left: x,
        top: y - GAP,
        transform: "translateX(-50%) translateY(-100%)",
      }}
    >
      <div className="relative bg-white border border-bg-disabled rounded-lg px-5 py-4 min-w-40">
        <div className="flex items-center justify-center gap-1.5 mb-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-status-red shrink-0" />
          <p className="font-body2 text-text-title font-semibold! tracking-tight">
            클릭 이상 징후 감지
          </p>
        </div>
        <div className="text-center">
          {message && (
            <p className="text-text-muted font-caption leading-5">{message}</p>
          )}
          {timestamp && (
            <p className="text-text-muted font-caption leading-5">
              {timestamp}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

const TrafficChart = memo(function TrafficChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, suspectDetail, isError } = useClickStream("dummy");

  // timeSeriesData → datetime 기반 차트 series 변환
  const DAY_MS = 24 * 60 * 60 * 1000;

  const {
    series,
    xAxisMin,
    xAxisMax,
    labelEndAs24h,
    anomalyTimestamp,
    anomalyY,
  } = useMemo(() => {
    const items = data?.timeSeriesData ?? [];
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();

    const chartData = items
      .filter((d) => (d.minute?.length ?? 0) >= 12)
      .map((d) => {
        const year = parseInt(d.minute.slice(0, 4), 10);
        const month = parseInt(d.minute.slice(4, 6), 10) - 1;
        const day = parseInt(d.minute.slice(6, 8), 10);
        const hour = parseInt(d.minute.slice(8, 10), 10);
        const min = parseInt(d.minute.slice(10, 12), 10);
        const x = new Date(year, month, day, hour, min).getTime();
        return { x, y: d.count, minute: d.minute };
      })
      .filter((p) => !Number.isNaN(p.x));

    // 해당 일 00:00 (데이터 없으면 오늘)
    let ds = todayStart;
    if (chartData.length > 0) {
      const minX = Math.min(...chartData.map((p) => p.x));
      const d0 = new Date(minX);
      ds = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate()).getTime();
    }

    // SSE는 보통 1시간 등 슬라이딩 윈도만 줌 → X축을 데이터 구간에 춤. 거의 하루일 때만 00~24h.
    let xMin = ds;
    let xMax = ds + DAY_MS;
    let endTickAs24h = true;
    if (chartData.length > 0) {
      const dataMin = Math.min(...chartData.map((p) => p.x));
      const dataMax = Math.max(...chartData.map((p) => p.x));
      let spanMs = dataMax - dataMin;
      if (spanMs <= 0) {
        const pad = 30 * 60 * 1000;
        xMin = dataMin - pad;
        xMax = dataMax + pad;
        endTickAs24h = false;
      } else if (spanMs >= DAY_MS * 0.9) {
        xMin = ds;
        xMax = ds + DAY_MS;
        endTickAs24h = true;
      } else {
        const pad = Math.max(60 * 1000, Math.round(spanMs * 0.08));
        xMin = dataMin - pad;
        xMax = dataMax + pad;
        endTickAs24h = false;
      }
    }

    // 이상 징후 발생 시 suspectDetail.timestamp로 해당 분 단위 지점을 마커로 표시
    let anomTs: number | undefined;
    let anomY: number | undefined;
    if (data?.hasSuspect && chartData.length > 0) {
      let matchIdx = -1;

      if (suspectDetail?.timestamp) {
        const ts = new Date(suspectDetail.timestamp);
        if (!isNaN(ts.getTime())) {
          const minute =
            ts.getFullYear().toString() +
            String(ts.getMonth() + 1).padStart(2, "0") +
            String(ts.getDate()).padStart(2, "0") +
            String(ts.getHours()).padStart(2, "0") +
            String(ts.getMinutes()).padStart(2, "0");
          matchIdx = chartData.findIndex((p) => p.minute === minute);
        }
      }

      // timestamp 매칭 실패 시 최대 클릭 지점으로 fallback
      if (matchIdx === -1) {
        matchIdx = chartData.reduce(
          (maxI, cur, i, arr) => (cur.y > arr[maxI].y ? i : maxI),
          0,
        );
      }

      anomTs = chartData[matchIdx]?.x;
      anomY = chartData[matchIdx]?.y;
    }

    return {
      series: [
        {
          name: "클릭수",
          data: chartData.map(({ x, y }) => ({ x, y })),
        },
      ],
      xAxisMin: xMin,
      xAxisMax: xMax,
      labelEndAs24h: endTickAs24h,
      anomalyTimestamp: anomTs,
      anomalyY: anomY,
    };
  }, [data, suspectDetail]);

  const chartOptions = useMemo(
    () =>
      buildChartOptions({
        xMin: xAxisMin,
        xMax: xAxisMax,
        labelEndAs24h,
        maxCount: Math.max(
          ...(data?.timeSeriesData?.map((d) => d.count) ?? [0]),
        ),
        anomalyTimestamp,
        anomalyY,
      }),
    [xAxisMin, xAxisMax, labelEndAs24h, data, anomalyTimestamp, anomalyY],
  );

  // 빨간 점의 컨테이너 기준 좌표 (anomalyTimestamp 변경 시 재계산)
  const markerPos = useAnomalyMarkerPos(containerRef, anomalyTimestamp);
  const [isAnomalyHovered, setIsAnomalyHovered] = useState(false);
  const [isAnomalyFocused, setIsAnomalyFocused] = useState(false);

  // 스크롤 중 pointer-events 제거 - setState 대신 DOM 직접 조작으로 리렌더 방지
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      container.style.pointerEvents = "none";
      container.classList.add("is-scrolling");
      clearTimeout(timer);
      timer = setTimeout(() => {
        container.style.pointerEvents = "";
        container.classList.remove("is-scrolling");
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

  if (isError && !data) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-100 gap-2 text-text-muted">
        <p className="font-body2">실시간 데이터를 불러오지 못했습니다.</p>
        <p className="font-caption">잠시 후 다시 시도해 주세요.</p>
      </div>
    );
  }

  if (!data) {
    return <Skeleton className="w-full h-100" />;
  }

  return (
    <>
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
            options={chartOptions}
            series={series}
            height={400}
          />
        </Suspense>
        {markerPos && (
          <>
            <span
              className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-status-red opacity-60 animate-ping [animation-duration:2s] in-[.is-scrolling]:[animation-play-state:paused] pointer-events-none"
              style={{ left: markerPos.x, top: markerPos.y }}
            />
            <span
              className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-status-red opacity-40 animate-ping [animation-duration:2s] [animation-delay:1s] in-[.is-scrolling]:[animation-play-state:paused] pointer-events-none"
              style={{ left: markerPos.x, top: markerPos.y }}
            />
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
            {showBubble && (
              <AnomalyBubble
                x={markerPos.x}
                y={markerPos.y}
                message={suspectDetail?.message}
                timestamp={suspectDetail?.timestamp}
              />
            )}
          </>
        )}
      </div>
    </>
  );
});

export default TrafficChart;
