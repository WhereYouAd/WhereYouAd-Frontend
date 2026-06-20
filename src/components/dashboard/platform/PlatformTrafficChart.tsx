import { memo, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

import type { TProviderType } from "@/types/dashboard/overview";
import { PLATFORM_CHART_COLORS } from "@/types/dashboard/provider";

import {
  formatCountChartAxis,
  formatCountChartTooltip,
  METRIC_REGISTRY as M,
} from "@/utils/dashboard/metricRegistry";
import { parseMinuteToTimestamp } from "@/utils/dashboard/parseMinuteToTimestamp";

import { Skeleton } from "@/components/common/skeleton/Skeleton";

import type { IClickStreamResponse } from "@/pages/dashboard/platform/platformDashboard.mock";

interface IPlatformTrafficChartProps {
  data: IClickStreamResponse | null;
  platform: string;
  isLoading?: boolean;
}

const PlatformTrafficChart = memo(function PlatformTrafficChart({
  data,
  platform,
  isLoading,
}: IPlatformTrafficChartProps) {
  const seriesData = useMemo(() => {
    if (!data) return [];
    return data.timeSeriesData.map((d) => ({
      x: parseMinuteToTimestamp(d.minute),
      y: d.count,
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

  const platformColor =
    PLATFORM_CHART_COLORS[platform as TProviderType] ??
    PLATFORM_CHART_COLORS.META;

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

  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "Pretendard",
      animations: { enabled: true, speed: 800 },
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

  if (isLoading || !data) {
    return <Skeleton className="w-full h-75 rounded-xl" />;
  }

  return (
    <div className="w-full h-full min-h-75">
      <ReactApexChart
        options={chartOptions}
        series={series}
        type="area"
        height={360}
      />
    </div>
  );
});

export default PlatformTrafficChart;
