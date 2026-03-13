import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { printAsPdf } from "@/utils/download";

import Badge from "@/components/common/badge/Badge";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import StatCard from "@/components/common/card/StatCard";
import ChartLegend from "@/components/common/chart/ChartLegend";
import Drawer from "@/components/common/drawer/Drawer";
import BudgetGaugeChart, {
  getBudgetStatus,
  statusBadgeVariant,
} from "@/components/dashboard/charts/BudgetGaugeChart";
import { budgetGaugeChartMock } from "@/components/dashboard/charts/budgetGaugeChart.mock";
import TrafficChart, {
  TrafficChartDownload,
} from "@/components/dashboard/charts/TrafficChart";
import PlatformRoasTable from "@/components/dashboard/platform/PlatformRoasTable";

import { overviewMockData } from "./overview.mock";
import OverviewAiReportPanel from "./OverviewAiReportPanel";

import DownloadIcon from "@/assets/icon/ai-report/download.svg?react";
import LinkIcon from "@/assets/icon/ai-report/link.svg?react";
import AlertCircleIcon from "@/assets/icon/common/alert-circle.svg?react";
import ChevronDoubleRightIcon from "@/assets/icon/common/chevron-double-right.svg?react";
import AiButtonSvg from "@/assets/logo/ai-요약버튼.svg?react";

export default function OverviewDashboard() {
  const navigate = useNavigate();
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [currentDate] = useState(() =>
    new Date().toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  );

  const budgetStatusBadge = useMemo(() => {
    const { totalBudget, spent, warningThreshold, dangerThreshold } =
      budgetGaugeChartMock;
    const pct = totalBudget > 0 ? Math.round((spent / totalBudget) * 100) : 0;
    const status = getBudgetStatus(pct, warningThreshold, dangerThreshold);
    return (
      <Badge variant={statusBadgeVariant[status]} size="sm" className="px-2">
        {status}
      </Badge>
    );
  }, []);

  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8 w-full min-w-0">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading2 text-text-main font-bold tracking-tight">
            통합 대시보드
          </h1>
          <p className="font-body2 text-text-sub">
            데이터 기준 · {currentDate}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAiPanelOpen(true)}
          className="group relative p-2 -mr-2 rounded-2xl outline-none cursor-pointer overflow-hidden"
          aria-label="AI 요약하기"
        >
          <div className="absolute inset-0 z-20 pointer-events-none -translate-x-full animate-[shimmer_2.5s_infinite_linear] bg-linear-to-r from-transparent via-white/80 to-transparent skew-x-12 mix-blend-overlay" />
          <div className="relative z-10 transition-all duration-200">
            <AiButtonSvg className="[&>path:nth-of-type(4)]:transition-transform [&>path:nth-of-type(4)]:duration-300 group-hover:[&>path:nth-of-type(4)]:translate-x-0.5 [&>path:nth-of-type(5)]:transition-transform [&>path:nth-of-type(5)]:duration-300 group-hover:[&>path:nth-of-type(5)]:translate-x-1" />
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {overviewMockData.kpis.map((kpi) => (
          <StatCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-7 gap-6">
        <Card
          className="2xl:col-span-5 flex flex-col min-h-120"
          title="실시간 트래픽 변화"
          description={
            <ChartLegend
              items={[
                { label: "클릭수", colorClass: "bg-status-blue" },
                { label: "이상 클릭 탐지", colorClass: "bg-status-red" },
              ]}
            />
          }
          RightElement={<TrafficChartDownload />}
        >
          <TrafficChart />
        </Card>
        <Card
          className="2xl:col-span-2 flex flex-col 2xl:min-h-120"
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
          RightElement={budgetStatusBadge}
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
            className="group flex items-center gap-1 h-8 px-4 bg-bg-surface/60 border-none hover:bg-bg-surface text-text-sub hover:text-text-auth-sub transition-all rounded-full"
          >
            <span className="font-caption font-bold pt-0.5">
              플랫폼 대시보드 살펴보기
            </span>
            <ChevronDoubleRightIcon className="w-2.5 h-auto" />
          </Button>
        }
        description={
          <div className="flex items-center gap-1.5 font-caption text-text-placeholder select-none">
            <AlertCircleIcon
              className="w-3.5 h-3.5 mt-px shrink-0"
              aria-hidden="true"
            />
            <span>ROAS 산출: 매출 ÷ 광고비 × 100</span>
          </div>
        }
      >
        <PlatformRoasTable />
      </Card>

      <Drawer
        isOpen={isAiPanelOpen}
        onClose={() => setIsAiPanelOpen(false)}
        hideHeader={false}
        disableScroll={false}
        className="w-full sm:max-w-160"
        dropdownItems={[
          {
            label: "링크 공유하기",
            icon: (
              <LinkIcon
                className="text-text-auth-sub group-hover:text-status-blue transition-colors"
                width={20}
                height={20}
              />
            ),
            onClick: () => {
              navigator.clipboard
                .writeText(window.location.href)
                .then(() => toast.success("링크가 복사되었습니다."))
                .catch(() => toast.error("링크 복사에 실패했습니다."));
            },
          },
          {
            label: "PDF로 저장하기",
            icon: (
              <DownloadIcon
                className="text-text-auth-sub group-hover:text-status-blue transition-colors"
                width={20}
                height={20}
              />
            ),
            onClick: () => printAsPdf("ai-report-printing"),
          },
        ]}
      >
        <OverviewAiReportPanel />
      </Drawer>
    </div>
  );
}
