import {
  memo,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

import type {
  IClickStreamItem,
  TProviderType,
} from "@/types/dashboard/overview";
import { PLATFORM_CHART_COLORS } from "@/types/dashboard/provider";
import {
  PLATFORM_TRAFFIC_CHART_HEIGHT_DUAL_MIN,
  PLATFORM_TRAFFIC_CHART_HEIGHT_SINGLE,
} from "@/constants/dashboard/trafficChartHeights";

import {
  formatCountChartAxis,
  formatCountChartTooltip,
  METRIC_REGISTRY as M,
} from "@/utils/dashboard/metricRegistry";
import { parseMinuteToTimestamp } from "@/utils/dashboard/parseMinuteToTimestamp";

import Button from "@/components/common/button/Button";
import { Skeleton } from "@/components/common/skeleton/Skeleton";
import { useAnomalyMarkerPos } from "@/components/dashboard/charts/useAnomalyMarkerPos";
import {
  PLATFORM_TRAFFIC_CHART_ID,
  PLATFORM_TRAFFIC_CONTAINER_ID,
} from "@/components/dashboard/platform/platformTrafficChartDownload.config";

interface IPlatformTrafficChartProps {
  data: IClickStreamItem | null;
  platform: TProviderType;
  isError?: boolean;
  suspectDetail: IClickStreamItem["suspectDetail"] | null;
  onRetry?: () => void;
  /** 예산 게이지 2개일 때 카드 높이에 맞춰 차트 영역 확장 */
  fillHeight?: boolean;
}

const DEFAULT_CHART_HEIGHT = PLATFORM_TRAFFIC_CHART_HEIGHT_SINGLE;
const MIN_CHART_HEIGHT = PLATFORM_TRAFFIC_CHART_HEIGHT_DUAL_MIN;
const CHART_ARIA_LABEL = "실시간 트래픽 변화 차트: 시간대별 클릭수 추이";

// 이상 징후 상세 버블
const AnomalyBubble = memo(function AnomalyBubble({
  id,
  x,
  y,
  message,
  campaignName,
  adName,
}: {
  id: string;
  x: number;
  y: number;
  message?: string;
  campaignName?: string;
  adName?: string;
}) {
  const GAP = 12;
  return (
    <div
      id={id}
      role="tooltip"
      className="pointer-events-none absolute transition-transform duration-200 ease-out"
      style={{
        left: x,
        top: y - GAP,
        transform: "translateX(-50%) translateY(-100%)",
      }}
    >
      <div className="relative min-w-40 rounded-lg border border-surface-400 bg-surface-100 px-5 py-4">
        <div className="mb-1.5 flex items-center justify-center gap-1.5">
          <span className="inline-block size-2 shrink-0 rounded-full bg-info-red" />
          <p className="font-label text-text-title">클릭 이상 징후 감지</p>
        </div>
        <div className="text-center">
          {campaignName && (
            <p className="font-caption text-text-muted">{campaignName}</p>
          )}
          {adName && <p className="font-caption text-text-muted">{adName}</p>}
          {message && <p className="font-caption text-text-muted">{message}</p>}
        </div>
      </div>
    </div>
  );
});

const PlatformTrafficChart = memo(function PlatformTrafficChart({
  data,
  platform,
  isError = false,
  suspectDetail = null,
  onRetry,
  fillHeight = false,
}: IPlatformTrafficChartProps) {
  const measureRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const anomalyBubbleId = useId();
  const [chartHeight, setChartHeight] = useState<number | null>(
    fillHeight ? null : DEFAULT_CHART_HEIGHT,
  );
  const [isHeightReady, setIsHeightReady] = useState(!fillHeight);
  const seriesData = useMemo(() => {
    if (!data) return [];
    return data.timeSeriesData.map((d) => ({
      x: parseMinuteToTimestamp(d.minute),
      y: d.count,
      minute: d.minute,
    }));
  }, [data]);

  // X축 범위 계산 (최근 60분)
  const { xMin, xMax } = useMemo(() => {
    if (seriesData.length === 0) return { xMin: undefined, xMax: undefined };
    return {
      xMin: seriesData[0].x,
      xMax: seriesData[seriesData.length - 1].x,
    };
  }, [seriesData]);

  const platformColor = PLATFORM_CHART_COLORS[platform];

  // Y축 최대값 계산
  const yMax = useMemo(() => {
    const counts = seriesData.map((d) => d.y);
    const maxCount = counts.length > 0 ? Math.max(...counts) : 0;
    if (maxCount <= 0) return 1000;

    const magnitude = Math.pow(10, Math.floor(Math.log10(maxCount)));
    // 최소 단위 100
    const unit = magnitude >= 100 ? magnitude : 100;
    return Math.ceil((maxCount * 1.2) / unit) * unit;
  }, [seriesData]);

  // 이상 징후 발생 시 마커 좌표
  // timestamp가 있으면 분 매칭, 없으면/실패 시 클릭수 최대 지점 fallback
  const { anomalyTimestamp, anomalyY } = useMemo(() => {
    if (!data?.hasSuspect || seriesData.length === 0) {
      return { anomalyTimestamp: undefined, anomalyY: undefined };
    }

    let matchIdx = -1;

    if (suspectDetail?.timestamp) {
      const ts = new Date(suspectDetail.timestamp);
      if (!Number.isNaN(ts.getTime())) {
        const minute =
          ts.getFullYear().toString() +
          String(ts.getMonth() + 1).padStart(2, "0") +
          String(ts.getDate()).padStart(2, "0") +
          String(ts.getHours()).padStart(2, "0") +
          String(ts.getMinutes()).padStart(2, "0");
        matchIdx = seriesData.findIndex((p) => p.minute === minute);
      }
    }

    if (matchIdx === -1) {
      matchIdx = seriesData.reduce(
        (maxI, cur, i, arr) => (cur.y > arr[maxI].y ? i : maxI),
        0,
      );
    }

    return {
      anomalyTimestamp: seriesData[matchIdx]?.x,
      anomalyY: seriesData[matchIdx]?.y,
    };
  }, [data?.hasSuspect, seriesData, suspectDetail]);

  const chartOptions: ApexOptions = {
    chart: {
      id: PLATFORM_TRAFFIC_CHART_ID,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "Pretendard",
      animations: fillHeight
        ? { enabled: false }
        : { enabled: true, speed: 800 },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: [platformColor],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100],
      },
    },
    colors: [platformColor],
    markers: { size: 0, hover: { size: 5 } },
    annotations: {
      points:
        anomalyTimestamp !== undefined && anomalyY !== undefined
          ? [
              {
                x: anomalyTimestamp,
                y: anomalyY,
                marker: {
                  size: 3,
                  fillColor: "var(--color-info-red)",
                  strokeColor: "var(--color-info-red)",
                  strokeWidth: 1,
                },
              },
            ]
          : [],
    },
    xaxis: {
      type: "numeric",
      min: xMin,
      max: xMax,
      tickAmount: 4,
      labels: {
        formatter: (val: string | number) => {
          const ts = Number(val);
          const d = new Date(ts);
          const h = String(d.getHours()).padStart(2, "0");
          const m = String(d.getMinutes()).padStart(2, "0");
          return `${h}:${m}`;
        },
        style: { colors: "var(--color-text-muted)", fontSize: "12px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      min: 0,
      max: yMax,
      tickAmount: 5,
      labels: {
        style: { colors: "var(--color-text-muted)", fontSize: "12px" },
        formatter: formatCountChartAxis,
      },
    },
    grid: {
      borderColor: "var(--color-surface-200)",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: {
        left: 16,
        right: 24,
      },
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (val) =>
          formatCountChartTooltip(val, M.clicks.chartTooltipUnit),
      },
      theme: "light",
    },
  };

  const series = [
    {
      name: M.clicks.label,
      data: seriesData,
    },
  ];

  // Apex annotation 점의 DOM 좌표 → 버블/링 위치
  const markerPos = useAnomalyMarkerPos(containerRef, anomalyTimestamp);
  const [isAnomalyHovered, setIsAnomalyHovered] = useState(false);
  const [isAnomalyFocused, setIsAnomalyFocused] = useState(false);

  const handleFocus = useCallback(() => setIsAnomalyFocused(true), []);
  const handleBlur = useCallback(() => setIsAnomalyFocused(false), []);
  const handlePointerEnter = useCallback(() => setIsAnomalyHovered(true), []);
  const handlePointerLeave = useCallback(() => setIsAnomalyHovered(false), []);
  const showBubble = isAnomalyHovered || isAnomalyFocused;

  useEffect(() => {
    if (!fillHeight) {
      setChartHeight(DEFAULT_CHART_HEIGHT);
      setIsHeightReady(true);
      return;
    }

    setChartHeight(null);
    setIsHeightReady(false);
  }, [fillHeight]);

  const hasChartData = Boolean(data && data.timeSeriesData.length > 0);

  useLayoutEffect(() => {
    if (!fillHeight || !hasChartData) return;

    const el = measureRef.current;
    if (!el) return;

    const updateHeight = () => {
      const next = Math.max(
        MIN_CHART_HEIGHT,
        Math.floor(el.getBoundingClientRect().height),
      );
      if (next <= 0) return;
      setChartHeight(next);
      setIsHeightReady(true);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, [fillHeight, hasChartData]);

  const fillContainerClassName = fillHeight
    ? "min-h-75 flex-1 overflow-hidden"
    : "h-75";

  const anomalyLayer =
    anomalyTimestamp !== undefined && anomalyY !== undefined && markerPos ? (
      <>
        <span
          className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-info-red opacity-60 [animation-duration:2s]"
          style={{ left: markerPos.x, top: markerPos.y }}
        />
        <span
          className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-info-red opacity-40 [animation-delay:1s] [animation-duration:2s]"
          style={{ left: markerPos.x, top: markerPos.y }}
        />
        <button
          type="button"
          className="absolute size-6 -translate-x-1/2 -translate-y-1/2 opacity-0"
          style={{ left: markerPos.x, top: markerPos.y }}
          aria-label="클릭 이상 징후 상세 보기"
          aria-describedby={showBubble ? anomalyBubbleId : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        />
        {showBubble && (
          <AnomalyBubble
            id={anomalyBubbleId}
            x={markerPos.x}
            y={markerPos.y}
            message={suspectDetail?.message}
            campaignName={suspectDetail?.campaignName}
            adName={suspectDetail?.adName}
          />
        )}
      </>
    ) : null;

  const connectionWarning = isError ? (
    <div className="mb-2 flex shrink-0 flex-wrap items-center gap-2">
      <p className="font-caption text-text-muted">
        연결이 원활하지 않아 마지막 데이터를 표시합니다.
      </p>
      {onRetry ? (
        <Button variant="outline" size="small" type="button" onClick={onRetry}>
          다시 시도
        </Button>
      ) : null}
    </div>
  ) : null;

  if (isError && !data) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-4 text-center ${fillContainerClassName}`}
      >
        <p className="font-body2 text-text-muted">
          실시간 데이터를 불러오지 못했습니다.
        </p>
        {onRetry ? (
          <Button
            variant="outline"
            size="small"
            type="button"
            onClick={onRetry}
          >
            다시 시도
          </Button>
        ) : null}
      </div>
    );
  }

  if (!data) {
    return (
      <Skeleton
        className={`w-full rounded-xl ${fillHeight ? "min-h-75 flex-1" : "h-75"}`}
      />
    );
  }

  if (data.timeSeriesData.length === 0) {
    return (
      <div
        className={`flex items-center justify-center font-body2 text-text-muted ${fillContainerClassName}`}
      >
        표시할 실시간 트래픽 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div
      className={
        fillHeight
          ? "flex w-full min-h-0 flex-1 flex-col overflow-hidden"
          : "flex h-full min-h-75 w-full flex-col"
      }
    >
      {connectionWarning}
      {fillHeight ? (
        <div
          ref={measureRef}
          className="relative min-h-0 flex-1 overflow-hidden"
        >
          {!isHeightReady || chartHeight === null ? (
            <Skeleton className="absolute inset-0 rounded-xl" />
          ) : (
            <div
              ref={containerRef}
              id={PLATFORM_TRAFFIC_CONTAINER_ID}
              role="group"
              aria-label={CHART_ARIA_LABEL}
              data-hide-tooltip={showBubble || undefined}
              className="absolute inset-0 overflow-hidden [&[data-hide-tooltip]_.apexcharts-tooltip]:pointer-events-none [&[data-hide-tooltip]_.apexcharts-tooltip]:invisible"
            >
              <ReactApexChart
                options={chartOptions}
                series={series}
                type="area"
                height={chartHeight}
              />
              {anomalyLayer}
            </div>
          )}
        </div>
      ) : (
        <div
          ref={containerRef}
          id={PLATFORM_TRAFFIC_CONTAINER_ID}
          role="group"
          aria-label={CHART_ARIA_LABEL}
          data-hide-tooltip={showBubble || undefined}
          className="relative min-h-75 [&[data-hide-tooltip]_.apexcharts-tooltip]:pointer-events-none [&[data-hide-tooltip]_.apexcharts-tooltip]:invisible"
        >
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="area"
            height={DEFAULT_CHART_HEIGHT}
          />
          {anomalyLayer}
        </div>
      )}
    </div>
  );
});

export default PlatformTrafficChart;
