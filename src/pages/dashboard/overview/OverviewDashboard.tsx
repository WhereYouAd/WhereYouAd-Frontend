import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import StatCard from "@/components/common/card/StatCard";
import ChartLegend from "@/components/common/chart/ChartLegend";
import Drawer from "@/components/common/drawer/Drawer";
import BudgetGaugeChart from "@/components/dashboard/charts/BudgetGaugeChart";
import { budgetGaugeChartMock } from "@/components/dashboard/charts/budgetGaugeChart.mock";
import TrafficChart from "@/components/dashboard/charts/TrafficChart";
import PlatformComparison from "@/components/dashboard/platform/PlatformComparison";

import { overviewMockData } from "./overview.mock";
import OverviewAiReportPanel from "./OverviewAiReportPanel";

import DownloadIcon from "@/assets/icon/ai-report/download.svg?react";
import LinkIcon from "@/assets/icon/ai-report/link.svg?react";
import ChevronDoubleRightIcon from "@/assets/icon/common/chevron-double-right.svg?react";
import AiButtonSvg from "@/assets/logo/ai-요약버튼.svg?react";

export default function OverviewDashboard() {
  const navigate = useNavigate();
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8 w-full min-w-0">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading2 text-text-main font-bold tracking-tight">
            통합 대시보드
          </h1>
          <p className="font-body2 text-text-sub">
            데이터 기준 ·{" "}
            {new Date().toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <button
          onClick={() => setIsAiPanelOpen(true)}
          className="p-3 rounded-full hover:bg-bg-surface-hover active:scale-95 transition-all outline-none"
          aria-label="AI 요약하기"
        >
          <AiButtonSvg />
        </button>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewMockData.kpis.map((kpi) => (
          <StatCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-7 gap-6">
        <Card
          className="xl:col-span-5 flex flex-col min-h-120"
          title="실시간 트래픽 변화"
          description={
            <ChartLegend
              items={[
                { label: "클릭수", colorClass: "bg-status-blue" },
                { label: "이상 클릭 탐지", colorClass: "bg-status-red" },
              ]}
            />
          }
        >
          <TrafficChart />
        </Card>
        <Card
          className="xl:col-span-2 flex flex-col min-h-120"
          title="예산 소진 현황"
          description={
            <ChartLegend
              items={[
                { label: "안정", colorClass: "bg-status-green" },
                { label: "주의", colorClass: "bg-status-yellow" },
                { label: "위험", colorClass: "bg-status-red" },
              ]}
            />
          }
        >
          <BudgetGaugeChart {...budgetGaugeChartMock} />
        </Card>
      </div>

      <Card
        title="플랫폼별 비교"
        RightElement={
          <Button
            variant="tertiary"
            onClick={() => navigate("/platform")}
            className="group flex items-center gap-1 h-8 px-4 bg-bg-surface/60 border-none hover:bg-bg-surface text-text-sub hover:text-text-main transition-all rounded-full"
          >
            <span className="font-caption font-bold pt-0.5">
              플랫폼 대시보드 살펴보기
            </span>
            <ChevronDoubleRightIcon className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        }
      >
        <PlatformComparison />
      </Card>

      <Drawer
        isOpen={isAiPanelOpen}
        onClose={() => setIsAiPanelOpen(false)}
        hideHeader={false}
        disableScroll={true}
        className="w-full sm:max-w-160"
        dropdownItems={[
          {
            label: "링크 공유하기",
            icon: (
              <LinkIcon
                className="text-text-disabled group-hover:text-status-blue transition-colors"
                width={20}
                height={20}
              />
            ),
            onClick: () => {
              alert("링크가 복사되었습니다.");
            },
          },
          {
            label: "PDF로 저장하기",
            icon: (
              <DownloadIcon
                className="text-text-disabled group-hover:text-status-blue transition-colors"
                width={20}
                height={20}
              />
            ),
            onClick: () => {
              alert("PDF 다운로드를 시작합니다.");
            },
          },
        ]}
      >
        <OverviewAiReportPanel />
      </Drawer>
    </div>
  );
}
