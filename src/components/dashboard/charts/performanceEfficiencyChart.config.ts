import type { ApexOptions } from "apexcharts";

export const getMixedChartOptions = (categories: string[]): ApexOptions => ({
  chart: {
    type: "line",
    toolbar: { show: false },
    fontFamily: "Pretendard",
    zoom: { enabled: false },
    selection: { enabled: false },
  },
  stroke: {
    show: true,
    width: [0, 0, 0.01],
  },
  markers: {
    size: [0, 0, 6], // 막대 = 0, 점 = 6
    strokeWidth: 2,
    strokeColors: "#ffffff",
    hover: { sizeOffset: 2 },
  },
  plotOptions: {
    bar: {
      columnWidth: "60%",
      borderRadius: 4,
      borderRadiusApplication: "end",
    },
  },
  colors: ["#0084fe", "#2f5bea", "#7a9bf8"],
  xaxis: {
    categories: categories,
    labels: {
      style: {
        fontSize: "14px",
        fontWeight: 500,
        colors: "#111827",
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: [
    {
      seriesName: "클릭률(CTR)",
      labels: {
        formatter: (val) => `${val.toFixed(1)}%`,
        style: {
          colors: "#9ca3af",
          fontSize: "12px",
        },
      },
    },
    {
      seriesName: "클릭률(CTR)",
      show: false,
    },
    {
      opposite: true,
      seriesName: "노출수",
      labels: {
        offsetX: -10,
        formatter: (val) => val.toLocaleString("ko-KR"),
        style: {
          colors: "#9ca3af",
          fontSize: "12px",
        },
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (val, { seriesIndex }) => {
        if (seriesIndex === 0 || seriesIndex === 1) {
          return `${val.toFixed(2)}%`;
        }
        return val.toLocaleString("ko-KR");
      },
    },
  },
  grid: {
    borderColor: "#f4f6fb",
    yaxis: { lines: { show: true } },
    padding: {
      bottom: -15,
      top: -15,
    },
  },
  legend: { show: false },
});
