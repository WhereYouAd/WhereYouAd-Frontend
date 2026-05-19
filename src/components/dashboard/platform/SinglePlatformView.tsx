import React, { useMemo } from "react";
import { twMerge } from "tailwind-merge";

import type { TPlatformProvider } from "@/types/dashboard/platform";

import { usePlatformBudget } from "@/hooks/dashboard/usePlatformBudget";
import { usePlatformMetricFacts } from "@/hooks/dashboard/usePlatformMetricFacts";
import { usePlatformMetrics } from "@/hooks/dashboard/usePlatformMetrics";

import Badge from "@/components/common/badge/Badge";
import Card from "@/components/common/card/Card";
import StatCard, { type ITrend } from "@/components/common/card/StatCard";
import ChartLegend from "@/components/common/chart/ChartLegend";
import { Skeleton } from "@/components/common/skeleton/Skeleton";
import BudgetGaugeChart, {
  getBudgetStatus,
  statusBadgeVariant,
} from "@/components/dashboard/charts/BudgetGaugeChart";
import PlatformDetailTable from "@/components/dashboard/platform/PlatformDetailTable";
import PlatformTrafficChart from "@/components/dashboard/platform/PlatformTrafficChart";

import GoogleLogo from "@/assets/logo/social-logo/wordmark/google-wordmark.svg?react";
import MetaLogo from "@/assets/logo/social-logo/wordmark/meta-wordmark.svg?react";
import NaverLogo from "@/assets/logo/social-logo/wordmark/naver-wordmark.svg?react";
import { platformTrafficMock } from "@/pages/dashboard/platform/platformDashboard.mock";

const PLATFORM_LOGOS: Record<
  string,
  { component: React.FC<React.SVGProps<SVGSVGElement>>; className: string }
> = {
  GOOGLE: { component: GoogleLogo, className: "h-10" },
  NAVER: { component: NaverLogo, className: "h-6 ml-2" },
  META: { component: MetaLogo, className: "h-6 ml-2" },
};

interface ISinglePlatformViewProps {
  platform: string;
  isLoading: boolean;
}

export default function SinglePlatformView({
  platform,
  isLoading,
}: ISinglePlatformViewProps) {
  const [viewRange, setViewRange] = React.useState<7 | 30>(7);

  const {
    data: platformData,
    isLoading: isMetricsLoading,
    isError: isMetricsError,
  } = usePlatformMetrics(platform.toUpperCase() as TPlatformProvider);

  const toTrend = (changeRate: number): ITrend => ({
    direction: changeRate >= 0 ? "up" : "down",
    value: `${Math.abs(changeRate).toFixed(2)}%`,
  });

  const kpis = useMemo(() => {
    if (!platformData) return [];

    return [
      {
        title: "노출수",
        value: platformData.impressions.toLocaleString(),
        trend: toTrend(platformData.impressionChangeRate),
      },
      {
        title: "클릭수 (CTR)",
        value: platformData.clicks.toLocaleString(),
        trend: toTrend(platformData.clickChangeRate),
      },
      {
        title: "전환율 (CVR)",
        value: `${platformData.conversion}%`,
        trend: toTrend(platformData.cvrChangeRate),
      },
      {
        title: "광고비 대비 매출 (ROAS)",
        value: `${platformData.ROAS}%`,
        trend: toTrend(platformData.ROASChangeRate),
      },
    ];
  }, [platformData]);

  const logoInfo = PLATFORM_LOGOS[platform.toUpperCase()];

  const {
    data: budget,
    isLoading: isBudgetLoading,
    isError: isBudgetError,
  } = usePlatformBudget(platform.toUpperCase() as TPlatformProvider);

  const {
    data: metricFacts,
    isLoading: isMetricFactsLoading,
    isError: isMetricFactsError,
  } = usePlatformMetricFacts(
    platform.toUpperCase() as TPlatformProvider,
    viewRange,
  );

  const budgetPct = budget
    ? Math.round((budget.spent / budget.totalBudget) * 100)
    : 0;

  const budgetStatus = budget
    ? getBudgetStatus(
        budgetPct,
        budget.warningThreshold,
        budget.dangerThreshold,
      )
    : null;

  const PLATFORM_THEME_COLORS: Record<string, string> = {
    GOOGLE: "#f9ab00",
    NAVER: "#03c75a",
    META: "#1877f2",
  };

  const platformColor =
    PLATFORM_THEME_COLORS[platform.toUpperCase()] || "#1877f2";

  return (
    <div className="flex flex-col gap-8">
      {/* platform header */}
      <div className="flex items-center justify-between">
        <div className="h-10 flex items-center">
          {logoInfo ? (
            <logoInfo.component
              className={twMerge("w-auto", logoInfo.className)}
            />
          ) : (
            <h2 className="font-heading2 text-text-title">{platform}</h2>
          )}
        </div>
      </div>

      {/* top */}
      <div className="grid grid-cols-4 tablet:grid-cols-2 gap-4">
        {isLoading || isMetricsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[24px] border border-surface-100/40 bg-surface-100/80 p-7 shadow-card backdrop-blur-sm flex flex-col gap-4"
            >
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          ))
        ) : isMetricsError ? (
          <div className="col-span-4 flex items-center justify-center py-8 text-center font-body2 text-text-muted">
            지표 데이터를 불러오지 못했습니다.
          </div>
        ) : !platformData ? (
          <div className="col-span-4 flex items-center justify-center py-8 text-center font-body2 text-text-muted">
            표시할 지표 데이터가 없습니다.
          </div>
        ) : (
          kpis.map((kpi) => (
            <StatCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
            />
          ))
        )}
      </div>

      {/* mid */}
      <div className="grid grid-cols-3 tablet:grid-cols-1 gap-6">
        <Card
          title="실시간 트래픽 변화"
          className="col-span-2 tablet:col-span-1 h-120 flex-col"
          description={
            <ChartLegend
              items={[
                { label: "클릭수", color: platformColor },
                { label: "이상 클릭 탐지", colorClass: "bg-info-red" },
              ]}
            />
          }
        >
          <PlatformTrafficChart
            data={platformTrafficMock[platform.toUpperCase()] || null}
            platform={platform.toUpperCase()}
            isLoading={isLoading}
          />
        </Card>

        <Card
          title="예산 소진 현황"
          className="col-span-1 tablet:col-span-1 h-120 flex flex-col"
          description={
            <ChartLegend
              items={[
                { label: "안정", colorClass: "bg-info-blue" },
                { label: "주의", colorClass: "bg-info-yellow" },
                { label: "위험", colorClass: "bg-info-red" },
              ]}
            />
          }
          RightElement={
            budgetStatus && (
              <Badge
                variant={statusBadgeVariant[budgetStatus]}
                className="px-2"
              >
                {budgetStatus}
              </Badge>
            )
          }
        >
          {isLoading || isBudgetLoading ? (
            <div className="flex flex-1 items-center justify-center p-8">
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          ) : isBudgetError ? (
            <div className="flex flex-1 items-center justify-center px-4 py-4 text-center font-body2 text-info-red">
              예산 데이터를 불러오지 못했습니다.
            </div>
          ) : budget ? (
            <div className="flex flex-1 flex-col">
              <BudgetGaugeChart {...budget} />
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center px-4 py-4 text-center font-body2 text-text-muted">
              표시할 예산 데이터가 없습니다.
            </div>
          )}
        </Card>
      </div>

      {/* bottom */}
      <Card
        title="광고 현황 상세"
        className="min-h-150"
        RightElement={
          <div className="flex overflow-hidden rounded-lg border border-surface-400">
            <button
              type="button"
              onClick={() => setViewRange(7)}
              className={twMerge(
                "px-4 py-2 font-body2 transition-all duration-200",
                viewRange === 7
                  ? "bg-info-blue text-surface-100 shadow-sm"
                  : "bg-surface-100 text-text-muted hover:bg-surface-200",
              )}
            >
              최근 7일
            </button>
            <button
              type="button"
              onClick={() => setViewRange(30)}
              className={twMerge(
                "border-l border-surface-400 px-4 py-2 font-body2 transition-all duration-200",
                viewRange === 30
                  ? "bg-info-blue text-surface-100 shadow-sm"
                  : "bg-surface-100 text-text-muted hover:bg-surface-200",
              )}
            >
              최근 30일
            </button>
          </div>
        }
      >
        {isLoading || isMetricFactsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ) : isMetricFactsError ? (
          <div className="flex items-center justify-center py-16 text-center font-body2 text-info-red">
            광고 현황 데이터를 불러오지 못했습니다.
          </div>
        ) : !metricFacts?.dailyRows.length ? (
          <div className="flex items-center justify-center py-16 text-center font-body2 text-text-muted">
            표시할 광고 현황 데이터가 없습니다.
          </div>
        ) : (
          <PlatformDetailTable
            data={metricFacts.dailyRows}
            total={metricFacts.totalRow}
          />
        )}
      </Card>
    </div>
  );
}
