import { memo, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

import { Skeleton } from "@/components/common/skeleton/Skeleton";

import type { IClickStreamResponse } from "@/pages/dashboard/platform/platformDashboard.mock";

interface IPlatformTrafficChartProps {
  data: IClickStreamResponse | null;
  platform: string;
  isLoading?: boolean;
}

const PLATFORM_COLORS: Record<string, string> = {
  GOOGLE: "#f9ab00",
  NAVER: "#03c75a",
  META: "#1877f2",
};

const PlatformTrafficChart = memo(function PlatformTrafficChart({
  data,
  platform,
  isLoading,
}: IPlatformTrafficChartProps) {
  // 데이터 변환: minute 문자열 -> 타임스탬프
  const seriesData = useMemo(() => {
    if (!data) return [];
    return data.timeSeriesData.map((d) => {
      const year = parseInt(d.minute.slice(0, 4), 10);
      const month = parseInt(d.minute.slice(4, 6), 10) - 1;
      const day = parseInt(d.minute.slice(6, 8), 10);
      const hour = parseInt(d.minute.slice(8, 10), 10);
      const min = parseInt(d.minute.slice(10, 12), 10);
      return {
        x: new Date(year, month, day, hour, min).getTime(),
        y: d.count,
      };
    });
  }, [data]);

  // X축 범위 계산 (최근 60분)
  const { xMin, xMax } = useMemo(() => {
    if (seriesData.length === 0) return { xMin: undefined, xMax: undefined };
    return {
      xMin: seriesData[0].x,
      xMax: seriesData[seriesData.length - 1].x,
    };
  }, [seriesData]);

  const platformColor = PLATFORM_COLORS[platform] || "#0084fe";

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
        style: { colors: "#8b8b8f", fontSize: "12px" },
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
        style: { colors: "#8b8b8f", fontSize: "12px" },
        formatter: (val) => {
          const rounded = Math.round(val);
          if (rounded <= 0) return "";
          if (rounded < 1000) return rounded.toLocaleString();
          return `${Math.round(rounded / 1000)}K`;
        },
      },
    },
    grid: {
      borderColor: "#f2f4f6",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: {
        left: 16,
        right: 24,
      },
    },
    tooltip: {
      x: { show: false },
      y: { formatter: (val) => `${val.toLocaleString()} 클릭` },
      theme: "light",
    },
  };

  const series = [
    {
      name: "클릭수",
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
