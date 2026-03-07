import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import StatCard from "@/components/common/card/StatCard";
import BudgetGaugeChart from "@/components/dashboard/charts/BudgetGaugeChart";
import { budgetGaugeChartMock } from "@/components/dashboard/charts/budgetGaugeChart.mock";
import TrafficChart from "@/components/dashboard/charts/TrafficChart";
import PlatformComparison from "@/components/dashboard/platform/PlatformComparison";

import { overviewMockData } from "./overview.mock";

export default function OverviewDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading3 text-text-main">통합 대시보드</h1>
          <p className="font-caption text-text-sub mt-1">
            데이터 기준 | 2026.01.06 09:13
          </p>
        </div>
        {/* TODO: AI 요약 버튼 */}
      </div>

      <div className="grid grid-cols-2 bg-white rounded-component-md border border-chart-inactive lg:flex lg:divide-x lg:divide-bg-surface">
        {overviewMockData.kpis.map((kpi, index) => (
          <div
            key={kpi.title}
            className={twMerge(
              "flex-1",
              index % 2 === 0 && "border-r border-bg-surface lg:border-r-0",
              index < 2 && "border-b border-bg-surface lg:border-b-0",
            )}
          >
            <StatCard className="border-0 rounded-none" {...kpi} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[10fr_4fr] gap-4">
        <Card
          title="실시간 트래픽 변화"
          description={
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-status-blue" />
                <span>클릭수</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-status-red" />
                <span>이상 클릭 탐지</span>
              </div>
            </div>
          }
        >
          <TrafficChart />
        </Card>
        <Card
          title="예산 소진 현황"
          description={
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-status-green" />
                <span>안정</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-status-yellow" />
                <span>주의</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-status-red" />
                <span>위험</span>
              </div>
            </div>
          }
        >
          <BudgetGaugeChart {...budgetGaugeChartMock} />
        </Card>
      </div>

      <Card
        title="플랫폼별 비교"
        RightElement={
          <Button size="small" onClick={() => navigate("/platform")}>
            플랫폼 대시보드 보기
          </Button>
        }
      >
        <PlatformComparison />
      </Card>
    </div>
  );
}
