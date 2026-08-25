import { memo, useCallback, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

import {
  PLATFORM_CHART_COLORS,
  PLATFORM_MAP,
  PROVIDER_TYPES,
} from "@/types/dashboard/provider";
import {
  ALL_PLATFORM_TRAFFIC_FILL,
  ALL_PLATFORM_TRAFFIC_STROKE,
} from "@/constants/dashboard/trafficChartExportStyles";

import {
  formatCountChartAxis,
  formatCountChartTooltip,
  METRIC_REGISTRY as M,
} from "@/utils/dashboard/metricRegistry";
import { parseMinuteToTimestamp } from "@/utils/dashboard/parseMinuteToTimestamp";

import { useClickStream } from "@/hooks/dashboard/useClickStream";

import Button from "@/components/common/button/Button";
import { Skeleton } from "@/components/common/skeleton/Skeleton";
import {
  PLATFORM_ALL_TRAFFIC_CHART_ID,
  PLATFORM_ALL_TRAFFIC_CONTAINER_ID,
} from "@/components/dashboard/platform/platformTrafficChartDownload.config";

const STREAM_MODE = "dummy" as const;

const AllPlatformTrafficChart = memo(function AllPlatformTrafficChart() {
  const googleStream = useClickStream({
    mode: STREAM_MODE,
    providerType: "GOOGLE",
  });
  const naverStream = useClickStream({
    mode: STREAM_MODE,
    providerType: "NAVER",
  });
  const metaStream = useClickStream({
    mode: STREAM_MODE,
    providerType: "META",
  });

  const streams = [googleStream, naverStream, metaStream];

  const reconnectFailedStreams = useCallback(() => {
    if (googleStream.isError) googleStream.reconnect();
    if (naverStream.isError) naverStream.reconnect();
    if (metaStream.isError) metaStream.reconnect();
  }, [googleStream, naverStream, metaStream]);

  // 첫 응답도 에러도 없는 스트림이 있으면 로딩
  const isLoading = streams.some((s) => s.data == null && !s.isError);

  const seriesData = useMemo(() => {
    const streamByPlatform = {
      GOOGLE: googleStream.data,
      NAVER: naverStream.data,
      META: metaStream.data,
    } as const;

    return PROVIDER_TYPES.map((platform) => ({
      name: PLATFORM_MAP[platform],
      color: PLATFORM_CHART_COLORS[platform],
      data:
        streamByPlatform[platform]?.timeSeriesData.map((d) => ({
          x: parseMinuteToTimestamp(d.minute),
          y: d.count,
        })) ?? [],
    }));
  }, [googleStream.data, naverStream.data, metaStream.data]);

  const hasAnySeries = seriesData.some((s) => s.data.length > 0);
  const isAllFailed = streams.every((s) => s.isError) && !hasAnySeries;
  const hasPartialError = !isAllFailed && streams.some((s) => s.isError);
  const isEmpty = !isLoading && !isAllFailed && !hasAnySeries;

  // 모든 플랫폼 데이터 중 최대값을 찾아 Y축 범위 계산
  const yMax = useMemo(() => {
    const allCounts = seriesData.flatMap((s) => s.data.map((d) => d.y));
    const maxCount = allCounts.length > 0 ? Math.max(...allCounts) : 0;
    if (maxCount <= 0) return 1000;

    const magnitude = Math.pow(10, Math.floor(Math.log10(maxCount)));
    const unit = magnitude >= 100 ? magnitude : 100;
    return Math.ceil((maxCount * 1.2) / unit) * unit;
  }, [seriesData]);

  // X축 범위 (모든 플랫폼 데이터 기준)
  const { xMin, xMax } = useMemo(() => {
    const allX = seriesData.flatMap((s) => s.data.map((d) => d.x));
    if (allX.length === 0) return { xMin: undefined, xMax: undefined };
    return {
      xMin: Math.min(...allX),
      xMax: Math.max(...allX),
    };
  }, [seriesData]);

  const chartOptions: ApexOptions = {
    chart: {
      id: PLATFORM_ALL_TRAFFIC_CHART_ID,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "Pretendard",
      animations: { enabled: true, speed: 800 },
    },
    dataLabels: { enabled: false },
    stroke: ALL_PLATFORM_TRAFFIC_STROKE,
    fill: ALL_PLATFORM_TRAFFIC_FILL,
    colors: PROVIDER_TYPES.map((platform) => PLATFORM_CHART_COLORS[platform]),
    markers: { size: 0, hover: { size: 5 } },
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
      shared: true, // 여러 플랫폼 동시 비교 가능
      intersect: false,
      x: { show: false },
      y: {
        formatter: (val) =>
          formatCountChartTooltip(val, M.clicks.chartTooltipUnit),
      },
      theme: "light",
    },
    legend: { show: false },
  };

  if (isAllFailed) {
    return (
      <div className="flex h-75 flex-col items-center justify-center gap-4 text-center">
        <p className="font-body2 text-text-muted">
          실시간 데이터를 불러오지 못했습니다.
        </p>
        <Button
          variant="outline"
          size="small"
          type="button"
          onClick={reconnectFailedStreams}
        >
          다시 시도
        </Button>
      </div>
    );
  }

  if (isLoading && !hasAnySeries) {
    return <Skeleton className="h-75 w-full rounded-xl" />;
  }

  if (isEmpty) {
    return (
      <div className="flex h-75 items-center justify-center font-body2 text-text-muted">
        표시할 실시간 트래픽 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-75 w-full flex-col">
      {hasPartialError && (
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <p className="font-caption text-text-muted">
            일부 플랫폼 실시간 데이터를 불러오지 못했습니다.
          </p>
          <Button
            variant="outline"
            size="small"
            type="button"
            onClick={reconnectFailedStreams}
          >
            다시 시도
          </Button>
        </div>
      )}
      <div id={PLATFORM_ALL_TRAFFIC_CONTAINER_ID} className="min-h-0 flex-1">
        <ReactApexChart
          options={chartOptions}
          series={seriesData}
          type="area"
          height="100%"
        />
      </div>
    </div>
  );
});

export default AllPlatformTrafficChart;
