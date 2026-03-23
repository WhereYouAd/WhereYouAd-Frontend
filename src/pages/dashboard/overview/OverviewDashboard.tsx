import { lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { printAsPdf } from "@/utils/download";

import { useOverviewBudget } from "@/hooks/dashboard/useOverviewBudget";
import { useOverviewMetrics } from "@/hooks/dashboard/useOverviewMetrics";
import { useOverviewRoasRankings } from "@/hooks/dashboard/useOverviewRoasRankings";

import Badge from "@/components/common/badge/Badge";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import StatCard from "@/components/common/card/StatCard";
import ChartLegend from "@/components/common/chart/ChartLegend";
import Drawer from "@/components/common/drawer/Drawer";
import PageHeader from "@/components/common/PageHeader";
import BudgetGaugeChart, {
  getBudgetStatus,
  statusBadgeVariant,
} from "@/components/dashboard/charts/BudgetGaugeChart";
import TrafficChart, {
  TrafficChartDownload,
} from "@/components/dashboard/charts/TrafficChart";
import PlatformRoasTable from "@/components/dashboard/platform/PlatformRoasTable";

import ChevronDoubleRightIcon from "@/assets/icon/chevron/chervon-double-right.svg?react";
import DownloadIcon from "@/assets/icon/common/download.svg?react";
import LinkIcon from "@/assets/icon/common/link.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";
import AiButtonSvg from "@/assets/logo/service-logo/ai-요약버튼.svg?react";

const OverviewAiReportPanel = lazy(() => import("./OverviewAiReportPanel"));

export default function OverviewDashboard() {
  const navigate = useNavigate();
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const {
    data: kpis,
    isLoading: isKpisLoading,
    isError: isKpisError,
    dataUpdatedAt,
  } = useOverviewMetrics();
  const { data: budget } = useOverviewBudget();
  const { data: roasRankingsData } = useOverviewRoasRankings();

  const currentDate = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  // 예산 상태 계산 - 카드 헤더 배지
  const budgetPct =
    budget && budget.totalBudget > 0
      ? Math.round((budget.spent / budget.totalBudget) * 100)
      : 0;
  const budgetStatus = budget
    ? getBudgetStatus(
        budgetPct,
        budget.warningThreshold,
        budget.dangerThreshold,
      )
    : "안정";

  return (
    <section className="flex flex-col gap-8 w-full min-w-0">
      <PageHeader
        title="통합 대시보드"
        description={currentDate ? `데이터 기준 · ${currentDate}` : undefined}
        actions={
          <button
            type="button"
            onClick={() => setIsAiPanelOpen(true)}
            className="group relative p-2 -mr-2 rounded-2xl outline-none cursor-pointer overflow-hidden"
            aria-label="AI 요약하기"
          >
            <div className="absolute inset-0 z-20 pointer-events-none -translate-x-full group-hover:animate-[shimmer_1.2s_ease-out] bg-linear-to-r from-transparent via-white/80 to-transparent skew-x-12 mix-blend-overlay" />
            <div className="relative z-10">
              <AiButtonSvg className="[&>path:nth-of-type(4)]:transition-transform [&>path:nth-of-type(4)]:duration-300 group-hover:[&>path:nth-of-type(4)]:translate-x-0.5 [&>path:nth-of-type(5)]:transition-transform [&>path:nth-of-type(5)]:duration-300 group-hover:[&>path:nth-of-type(5)]:translate-x-1" />
            </div>
          </button>
        }
      />

      <div className="grid grid-cols-4 tablet:grid-cols-2 gap-4">
        {isKpisError ? (
          <div className="col-span-4 tablet:col-span-2 flex items-center justify-center py-8 rounded-[24px] bg-white/80 border border-white/40 text-status-red font-body2">
            지표 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </div>
        ) : isKpisLoading ? (
          // TODO: 스켈레톤 UI 통일 작업 시 개선
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-7 flex flex-col gap-4 border border-white/40 animate-pulse"
            >
              <div className="h-4 w-16 rounded bg-bg-surface" />
              <div className="h-8 w-24 rounded bg-bg-surface" />
              <div className="h-6 w-14 rounded-full bg-bg-surface" />
            </div>
          ))
        ) : (
          (kpis ?? []).map((kpi) => <StatCard key={kpi.title} {...kpi} />)
        )}
      </div>

      <div className="grid grid-cols-7 tablet:grid-cols-1 gap-6">
        <Card
          className="col-span-5 tablet:col-span-1 flex flex-col min-h-120"
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
          className="col-span-2 tablet:col-span-1 flex flex-col min-h-120"
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
          RightElement={
            <Badge
              variant={statusBadgeVariant[budgetStatus]}
              size="sm"
              className="px-2"
            >
              {budgetStatus}
            </Badge>
          }
        >
          {budget ? (
            <BudgetGaugeChart {...budget} />
          ) : (
            // TODO: 스켈레톤 UI 통일 작업 시 개선
            <div className="flex-1 animate-pulse rounded-2xl bg-bg-surface" />
          )}
        </Card>
      </div>

      <Card
        title="플랫폼별 비교"
        RightElement={
          <Button
            variant="tertiary"
            onClick={() => navigate("/platform")}
            className="group flex items-center gap-1 h-8 px-4 bg-bg-surface/60 border-none hover:bg-bg-surface text-text-sub hover:text-text-auth-sub transition-colors rounded-full"
          >
            <span className="font-caption font-bold leading-none">
              플랫폼 대시보드 살펴보기
            </span>
            <ChevronDoubleRightIcon className="w-4.5 h-4.5" />
          </Button>
        }
        description={
          <div className="flex items-center gap-1.5 font-caption text-text-placeholder select-none">
            <WarnCircleIcon
              className="w-3.5 h-3.5 mt-px shrink-0"
              aria-hidden="true"
            />
            <span>ROAS 산출: 매출 ÷ 광고비 × 100</span>
          </div>
        }
      >
        <PlatformRoasTable rankings={roasRankingsData ?? []} />
      </Card>

      <Drawer
        isOpen={isAiPanelOpen}
        onClose={() => setIsAiPanelOpen(false)}
        hideHeader={false}
        disableScroll={false}
        className="w-full max-w-160"
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
        {isAiPanelOpen && (
          <Suspense fallback={null}>
            <OverviewAiReportPanel />
          </Suspense>
        )}
      </Drawer>
    </section>
  );
}
