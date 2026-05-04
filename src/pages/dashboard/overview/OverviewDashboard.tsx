import { lazy, type ReactNode, Suspense, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
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
import {
  Skeleton,
  SkeletonCircle,
} from "@/components/common/skeleton/Skeleton";
import BudgetGaugeChart, {
  getBudgetStatus,
  statusBadgeVariant,
} from "@/components/dashboard/charts/BudgetGaugeChart";
import TrafficChart, {
  TrafficChartDownload,
} from "@/components/dashboard/charts/TrafficChart";
import PlatformRoasTable from "@/components/dashboard/platform/PlatformRoasTable";

import SparkleCircleIcon from "@/assets/icon/ai/sparkle-circle.svg?react";
import ChevronDoubleRightIcon from "@/assets/icon/chevron/chervon-double-right.svg?react";
import DownloadIcon from "@/assets/icon/common/download.svg?react";
import LinkIcon from "@/assets/icon/common/link.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";
import AiButtonSvg from "@/assets/logo/service-logo/ai-요약버튼.svg?react";

const OverviewAiReportPanel = lazy(() => import("./OverviewAiReportPanel"));

type TDashboardHeaderContext = {
  setHeaderRight?: (node: ReactNode | null) => void;
};

export default function OverviewDashboard() {
  const navigate = useNavigate();
  const { setHeaderRight } = useOutletContext<TDashboardHeaderContext>();
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const {
    data: kpis,
    isLoading: isKpisLoading,
    isError: isKpisError,
    error: kpisError,
  } = useOverviewMetrics();
  const {
    data: budget,
    isLoading: isBudgetLoading,
    isError: isBudgetError,
    error: budgetError,
  } = useOverviewBudget();
  const {
    data: roasRankingsData,
    isLoading: isRankingsLoading,
    isError: isRankingsError,
    error: rankingsError,
  } = useOverviewRoasRankings();

  // 예산 상태 계산 - 카드 헤더 배지
  const budgetPct =
    budget && budget.totalBudget > 0
      ? Math.round((budget.spent / budget.totalBudget) * 100)
      : 0;
  const budgetStatus =
    budget && !isBudgetLoading
      ? getBudgetStatus(
          budgetPct,
          budget.warningThreshold,
          budget.dangerThreshold,
        )
      : null;

  useEffect(() => {
    if (!setHeaderRight) return;

    setHeaderRight(
      <button
        type="button"
        onClick={() => setIsAiPanelOpen(true)}
        className="group relative h-8 px-1 -mr-2 rounded-2xl outline-none cursor-pointer overflow-hidden inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-logo-2/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        aria-label="AI 요약하기"
      >
        <div className="absolute inset-0 z-20 pointer-events-none -translate-x-full group-hover:animate-[shimmer_1.2s_ease-out] bg-linear-to-r from-transparent via-white/80 to-transparent skew-x-12 mix-blend-overlay" />
        <div className="relative z-10">
          <span className="sm:hidden">
            <SparkleCircleIcon className="w-5 h-5 text-logo-1 fill-current" />
          </span>
          <span className="hidden sm:block">
            <AiButtonSvg className="h-6 w-auto [&>path:nth-of-type(4)]:transition-transform [&>path:nth-of-type(4)]:duration-300 group-hover:[&>path:nth-of-type(4)]:translate-x-0.5 [&>path:nth-of-type(5)]:transition-transform [&>path:nth-of-type(5)]:duration-300 group-hover:[&>path:nth-of-type(5)]:translate-x-1" />
          </span>
        </div>
      </button>,
    );

    return () => {
      setHeaderRight(null);
    };
  }, [setHeaderRight]);

  return (
    <section className="flex flex-col gap-8 w-full min-w-0">
      <div className="grid grid-cols-4 tablet:grid-cols-2 gap-4">
        {isKpisError ? (
          <div className="col-span-4 tablet:col-span-2 flex items-center justify-center py-8 rounded-[24px] bg-white/80 border border-white/40 text-status-red font-body2">
            {kpisError?.message ??
              "지표 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."}
          </div>
        ) : isKpisLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-7 flex flex-col gap-4 border border-white/40"
            >
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-6 w-14 rounded-full" />
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
          <Suspense
            fallback={<Skeleton className="flex-1 w-full rounded-2xl" />}
          >
            <TrafficChart />
          </Suspense>
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
            budgetStatus ? (
              <Badge
                variant={statusBadgeVariant[budgetStatus]}
                size="sm"
                className="px-2"
              >
                {budgetStatus}
              </Badge>
            ) : undefined
          }
        >
          {isBudgetError ? (
            <div className="flex flex-1 items-center justify-center text-status-red font-body2 text-center px-4">
              {budgetError?.message ?? (
                <>
                  예산 데이터를 불러오지 못했습니다.
                  <br />
                  잠시 후 다시 시도해 주세요.
                </>
              )}
            </div>
          ) : isBudgetLoading ? (
            <div className="flex flex-col flex-1 gap-4 pt-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-3 w-full rounded-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="mt-auto h-16 w-full rounded-2xl" />
            </div>
          ) : budget ? (
            <BudgetGaugeChart {...budget} />
          ) : null}
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
            <span className="font-caption font-semibold">
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
        {isRankingsError ? (
          <div className="flex items-center justify-center py-16 text-status-red font-body2">
            {rankingsError?.message ??
              "플랫폼 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."}
          </div>
        ) : isRankingsLoading ? (
          <div className="flex flex-col divide-y divide-[#F2F4F6]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[32px_1.5fr_2.5fr_1.5fr] gap-x-4 px-4 py-4 min-h-20 items-center"
              >
                <Skeleton className="h-4 w-4 mx-auto" />
                <div className="flex items-center gap-3">
                  <SkeletonCircle className="h-7 w-7 shrink-0" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex flex-col gap-2 pr-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <PlatformRoasTable rankings={roasRankingsData ?? []} />
        )}
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
