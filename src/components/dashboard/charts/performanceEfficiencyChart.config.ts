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
    width: [0, 0, 0.01], // 선을 거의 투명하게 설정하여 렌더링 엔진에서 제외되지 않도록 함
  },
  markers: {
    size: [0, 0, 6], // 막대 = 0, 점 = 6
    strokeWidth: 2,
    strokeColors: "#fff",
    hover: { sizeOffset: 2 },
  },
  plotOptions: {
    bar: {
      columnWidth: "60%",
      borderRadius: 4,
      borderRadiusApplication: "end",
    },
  },
  colors: ["#0084fe", "#0a3d91", "#4fc3f7"], // status-blue (CTR), Chart 1 (CVR), Chart 5 (Impressions)
  xaxis: {
    categories: categories,
    labels: {
      style: {
        fontSize: "14px",
        fontWeight: 500,
        colors: "#212121",
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: [
    {
      seriesName: "클릭률",
      labels: {
        formatter: (val) => `${val.toFixed(1)}%`,
        style: {
          colors: "#8B8B8F",
          fontSize: "12px",
        },
      },
    },
    { show: false, seriesName: "전환율" },
    {
      opposite: true,
      seriesName: "노출수",
      labels: {
        offsetX: -10,
        formatter: (val) => val.toLocaleString(),
        style: {
          colors: "#8B8B8F",
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
        return val.toLocaleString();
      },
    },
  },
  grid: {
    borderColor: "#f1f1f1",
    yaxis: { lines: { show: true } },
    padding: {
      bottom: -15,
      top: -15,
    },
  },
  legend: { show: false },
});
