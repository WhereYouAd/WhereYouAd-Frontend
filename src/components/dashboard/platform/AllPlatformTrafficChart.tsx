import { memo, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

import { Skeleton } from "@/components/common/skeleton/Skeleton";

import { platformTrafficMock } from "@/pages/dashboard/platform/platformDashboard.mock";

interface IAllPlatformTrafficChartProps {
  isLoading?: boolean;
}

const PLATFORM_COLORS = {
  GOOGLE: "#f9ab00",
  NAVER: "#03c75a",
  META: "#1877f2",
};

const AllPlatformTrafficChart = memo(function AllPlatformTrafficChart({
  isLoading,
}: IAllPlatformTrafficChartProps) {
  // 3개 플랫폼의 데이터를 모두 변환하여 series 구성
  const seriesData = useMemo(() => {
    const platforms = ["GOOGLE", "NAVER", "META"] as const;

    return platforms.map((platform) => {
      const data = platformTrafficMock[platform];
      return {
        name:
          platform === "GOOGLE"
            ? "Google"
            : platform === "NAVER"
              ? "NAVER"
              : "Meta",
        color: PLATFORM_COLORS[platform],
        data: data.timeSeriesData.map((d) => {
          const year = parseInt(d.minute.slice(0, 4), 10);
          const month = parseInt(d.minute.slice(4, 6), 10) - 1;
          const day = parseInt(d.minute.slice(6, 8), 10);
          const hour = parseInt(d.minute.slice(8, 10), 10);
          const min = parseInt(d.minute.slice(10, 12), 10);
          return {
            x: new Date(year, month, day, hour, min).getTime(),
            y: d.count,
          };
        }),
      };
    });
  }, []);

  // 모든 플랫폼 데이터 중 최대값을 찾아 Y축 범위 계산
  const yMax = useMemo(() => {
    const allCounts = seriesData.flatMap((s) => s.data.map((d) => d.y));
    const maxCount = allCounts.length > 0 ? Math.max(...allCounts) : 0;
    if (maxCount <= 0) return 1000;

    const magnitude = Math.pow(10, Math.floor(Math.log10(maxCount)));
    const unit = magnitude >= 100 ? magnitude : 100;
    return Math.ceil((maxCount * 1.2) / unit) * unit;
  }, [seriesData]);

  // X축 범위 (첫 번째 데이터 기준)
  const { xMin, xMax } = useMemo(() => {
    const firstSeries = seriesData[0].data;
    if (firstSeries.length === 0) return { xMin: undefined, xMax: undefined };
    return {
      xMin: firstSeries[0].x,
      xMax: firstSeries[firstSeries.length - 1].x,
    };
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
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.2,
        opacityTo: 0.05,
        stops: [20, 100],
      },
    },
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
      shared: true, // 여러 플랫폼 동시 비교 가능
      intersect: false,
      x: { show: false },
      y: { formatter: (val) => `${val.toLocaleString()} 클릭` },
      theme: "light",
    },
    legend: { show: false },
  };

  if (isLoading) {
    return <Skeleton className="w-full h-full rounded-xl" />;
  }

  return (
    <div className="w-full h-full min-h-75">
      <ReactApexChart
        options={chartOptions}
        series={seriesData}
        type="area"
        height="100%"
      />
    </div>
  );
});

export default AllPlatformTrafficChart;
