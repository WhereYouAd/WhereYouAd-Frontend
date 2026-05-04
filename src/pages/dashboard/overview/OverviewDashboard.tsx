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
import OverviewCampaignSnapshotCard from "@/pages/dashboard/overview/OverviewCampaignSnapshotCard";

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

  const kpiList = kpis ?? [];
  const kpiStatClassName = "py-5 gap-3";

  const kpiSkeletonCard = (key: string | number) => (
    <div
      key={key}
      className="bg-white/80 backdrop-blur-sm rounded-component-lg shadow-card px-7 py-5 flex flex-col gap-3 border border-white/40"
    >
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-6 w-14 rounded-full" />
    </div>
  );

  return (
    <section className="flex w-full min-w-0 flex-col gap-6">
      {/* 상단: KPI+트래픽(3) | 예산+스냅샷(1) — 플랫폼 비교는 아래 풀폭 */}
      <div className="grid w-full min-w-0 grid-cols-4 items-stretch gap-6 tablet:grid-cols-1 tablet:gap-6">
        <div className="col-span-3 flex h-full min-h-0 min-w-0 flex-col gap-6 tablet:col-span-1">
          {isKpisError ? (
            <div className="flex items-center justify-center rounded-[24px] border border-white/40 bg-white/80 py-8 font-body2 text-status-red">
              {kpisError?.message ??
                "지표 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."}
            </div>
          ) : (
            <div className="grid min-w-0 grid-cols-4 gap-4 tablet:grid-cols-2 tablet:gap-4">
              {isKpisLoading
                ? [0, 1, 2, 3].map((i) => kpiSkeletonCard(`d-${i}`))
                : kpiList.map((kpi) => (
                    <StatCard
                      key={`d-${kpi.title}`}
                      {...kpi}
                      className={kpiStatClassName}
                    />
                  ))}
            </div>
          )}

          <Card
            className="flex min-h-120 w-full min-w-0 flex-1 flex-col"
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
            <div className="flex min-h-0 flex-1 flex-col">
              <Suspense
                fallback={
                  <Skeleton className="min-h-60 w-full flex-1 rounded-2xl" />
                }
              >
                <TrafficChart />
              </Suspense>
            </div>
          </Card>
        </div>

        <div className="col-span-1 flex h-full min-h-0 min-w-0 flex-col gap-3 tablet:col-span-1">
          <div className="flex min-h-0 flex-[2_1_0%] flex-col">
            <Card
              className="flex h-full min-h-0 min-w-0 flex-col !pb-4"
              title="예산 소진 현황"
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
              <div className="flex min-h-0 flex-1 flex-col">
                {isBudgetError ? (
                  <div className="flex flex-1 items-center justify-center px-4 py-4 text-center font-body2 text-status-red">
                    {budgetError?.message ?? (
                      <>
                        예산 데이터를 불러오지 못했습니다.
                        <br />
                        잠시 후 다시 시도해 주세요.
                      </>
                    )}
                  </div>
                ) : isBudgetLoading ? (
                  <div className="flex min-h-0 flex-1 flex-col justify-between gap-3 pt-1">
                    <div className="flex shrink-0 flex-col gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-2 w-full rounded-full" />
                      <div className="flex justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <Skeleton className="h-3 w-10" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Skeleton className="h-3 w-14" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1.5 rounded-lg border border-bg-disabled/25 bg-bg-surface/40 p-2.5">
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-5 w-28" />
                      </div>
                      <Skeleton className="h-8 w-full rounded-md" />
                    </div>
                  </div>
                ) : budget ? (
                  <BudgetGaugeChart {...budget} compact fillColumn />
                ) : null}
              </div>
            </Card>
          </div>

          <div className="flex min-h-0 flex-[1_1_0%] flex-col justify-start overflow-hidden">
            <OverviewCampaignSnapshotCard className="max-h-full shrink-0" />
          </div>
        </div>
      </div>

      <Card
        className="w-full min-w-0 shrink-0"
        title="플랫폼별 비교"
        RightElement={
          <Button
            variant="tertiary"
            onClick={() => navigate("/platform")}
            className="group flex h-8 items-center gap-1 rounded-full border-none bg-bg-surface/60 px-4 hover:bg-bg-surface text-text-sub hover:text-text-auth-sub transition-colors"
          >
            <span className="font-caption font-semibold">
              플랫폼 대시보드 살펴보기
            </span>
            <ChevronDoubleRightIcon className="w-4.5 h-4.5" />
          </Button>
        }
        description={
          <div className="flex select-none items-center gap-1.5 font-caption text-text-placeholder">
            <WarnCircleIcon
              className="mt-px h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
            <span>ROAS 산출: 매출 ÷ 광고비 × 100</span>
          </div>
        }
      >
        {isRankingsError ? (
          <div className="flex items-center justify-center py-16 font-body2 text-status-red">
            {rankingsError?.message ??
              "플랫폼 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."}
          </div>
        ) : isRankingsLoading ? (
          <div className="flex flex-col divide-y divide-[#F2F4F6]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="grid min-h-20 grid-cols-[32px_1.5fr_2.5fr_1.5fr] items-center gap-x-4 px-4 py-4"
              >
                <Skeleton className="mx-auto h-4 w-4" />
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
