import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface IBudgetGaugeChartProps {
  percentage: number;
  totalBudget: number;
  spent: number;
  warningThreshold: number;
  dangerThreshold: number;
}

// 상태 색상 반환
const getStatusColor = (
  value: number,
  warning: number,
  danger: number,
): string => {
  if (value >= danger) return "#ff2a4b"; // --color-status-red
  if (value >= warning) return "#facc15"; // --color-status-yellow
  return "#22c55e"; // --color-status-green
};

export default function BudgetGaugeChart({
  percentage,
  totalBudget,
  spent,
  warningThreshold,
  dangerThreshold,
}: IBudgetGaugeChartProps) {
  const remaining = totalBudget - spent;

  const statusColor = getStatusColor(
    percentage,
    warningThreshold,
    dangerThreshold,
  );

  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      fontFamily: "Pretendard",
      offsetY: -20,
      animations: { enabled: true, dynamicAnimation: { enabled: false } },
    },
    plotOptions: {
      radialBar: {
        // 반원 게이지
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: "60%",
          background: "transparent",
        },
        track: {
          background: "#f2f4f6",
          strokeWidth: "100%",
          margin: 0,
        },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: -30,
            fontSize: "28px",
            fontWeight: "700",
            color: statusColor,
            formatter: (val: number) => `${val}%`,
          },
        },
      },
    },
    // 소진률 임계값 기준으로 단색 적용
    fill: { type: "solid", opacity: 1 },
    colors: [statusColor],
    legend: { show: false },
    states: {
      hover: { filter: { type: "none" } },
      active: { filter: { type: "none" } },
    },
    // 차트 너비 기준 반응형 옵션
    responsive: [
      {
        breakpoint: 260,
        options: {
          chart: { offsetY: -10 },
          plotOptions: {
            radialBar: {
              dataLabels: {
                value: { fontSize: "20px", offsetY: -20 },
              },
            },
          },
        },
      },
    ],
  };

  return (
    <div className="flex flex-col items-center h-full">
      <div className="relative overflow-hidden h-32 lg:h-36 w-full">
        {/* 예산 소진 그래프 */}
        <ReactApexChart
          type="radialBar"
          options={options}
          series={[percentage]}
          height={300}
        />
      </div>

      {/* 예산 상세 정보 */}
      <div className="mt-12 flex flex-col gap-5 w-full">
        <div className="flex justify-between">
          <span className="font-body1 text-text-sub">총 예산</span>
          <span className="font-body1 text-text-main">
            ₩{totalBudget.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-body1 text-text-sub">현재 소진</span>
          <span className="font-body1 text-text-main">
            ₩{spent.toLocaleString()}
          </span>
        </div>
        <div className="h-px bg-bg-surface" />
        <div className="flex justify-between">
          <span className="font-heading3 text-text-auth-sub font-bold">
            잔액
          </span>
          <span className="font-heading3 text-text-auth-sub font-bold">
            ₩{remaining.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
