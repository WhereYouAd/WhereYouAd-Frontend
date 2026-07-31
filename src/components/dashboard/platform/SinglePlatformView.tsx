import React, { useMemo } from "react";
import { twMerge } from "tailwind-merge";

import type { TProviderType } from "@/types/dashboard/overview";
import { PLATFORM_CHART_COLORS } from "@/types/dashboard/provider";

import { METRIC_REGISTRY as M } from "@/utils/dashboard/metricRegistry";
import { metricsToKpis } from "@/utils/dashboard/metricsToKpis";

import { useBudget } from "@/hooks/dashboard/useBudget";
import { useClickStream } from "@/hooks/dashboard/useClickStream";
import { usePlatformMetricFacts } from "@/hooks/dashboard/usePlatformMetricFacts";
import { usePlatformMetrics } from "@/hooks/dashboard/usePlatformMetrics";

import Card from "@/components/common/card/Card";
import StatCard from "@/components/common/card/StatCard";
import ChartLegend from "@/components/common/chart/ChartLegend";
import ChartErrorFallback from "@/components/common/error/ChartErrorFallback";
import { ErrorBoundary } from "@/components/common/error/ErrorBoundary";
import MetricErrorFallback from "@/components/common/error/MetricErrorFallback";
import { Skeleton } from "@/components/common/skeleton/Skeleton";
import DashboardAiSummarySection from "@/components/dashboard/ai-report/components/DashboardAiSummarySection";
import BudgetGaugeChart from "@/components/dashboard/charts/BudgetGaugeChart";
import PlatformDetailTable from "@/components/dashboard/platform/PlatformDetailTable";
import PlatformTrafficChart from "@/components/dashboard/platform/PlatformTrafficChart";

import GoogleLogo from "@/assets/logo/social-logo/wordmark/google-wordmark.svg?react";
import MetaLogo from "@/assets/logo/social-logo/wordmark/meta-wordmark.svg?react";
import NaverLogo from "@/assets/logo/social-logo/wordmark/naver-wordmark.svg?react";

const PLATFORM_LOGOS: Record<
  string,
  { component: React.FC<React.SVGProps<SVGSVGElement>>; className: string }
> = {
  GOOGLE: { component: GoogleLogo, className: "h-10" },
  NAVER: { component: NaverLogo, className: "h-6 ml-2" },
  META: { component: MetaLogo, className: "h-6 ml-2" },
};

interface ISinglePlatformViewProps {
  platform: TProviderType;
}

export default function SinglePlatformView({
  platform,
}: ISinglePlatformViewProps) {
  const [viewRange, setViewRange] = React.useState<7 | 30>(7);

  const {
    data: platformData,
    isLoading: isMetricsLoading,
    isError: isMetricsError,
  } = usePlatformMetrics(platform);

  const kpis = useMemo(
    () => (platformData ? metricsToKpis(platformData) : []),
    [platformData],
  );

  const logoInfo = PLATFORM_LOGOS[platform];

  const {
    data: budgetData,
    isLoading: isBudgetLoading,
    isError: isBudgetError,
  } = useBudget(platform);

  const {
    data: metricFacts,
    isLoading: isMetricFactsLoading,
    isError: isMetricFactsError,
  } = usePlatformMetricFacts(platform, viewRange);

  const {
    data: clickStreamData,
    suspectDetail,
    isError: isClickStreamError,
    reconnect: reconnectClickStream,
  } = useClickStream({
    mode: "dummy",
    providerType: platform,
  });

  const platformColor = PLATFORM_CHART_COLORS[platform];

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
      <ErrorBoundary
        FallbackComponent={MetricErrorFallback}
        resetKeys={[platformData]}
      >
        <div className="grid grid-cols-4 tablet:grid-cols-2 gap-4">
          {isMetricsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-surface-100/40 bg-surface-100/80 p-7 shadow-Soft backdrop-blur-sm flex flex-col gap-4"
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
      </ErrorBoundary>

      {/* mid */}
      <div className="grid grid-cols-3 tablet:grid-cols-1 gap-6">
        <Card
          title="실시간 트래픽 변화"
          className="col-span-2 tablet:col-span-1 h-120 flex-col"
          description={
            <ChartLegend
              items={[
                { label: M.clicks.label, color: platformColor },
                { label: "이상 클릭 탐지", colorClass: "bg-info-red" },
              ]}
            />
          }
        >
          <ErrorBoundary
            FallbackComponent={ChartErrorFallback}
            resetKeys={[clickStreamData, platform]}
          >
            <PlatformTrafficChart
              data={clickStreamData}
              platform={platform}
              isError={isClickStreamError}
              suspectDetail={suspectDetail}
              onRetry={reconnectClickStream}
            />
          </ErrorBoundary>
        </Card>

        <Card
          title="예산 소진 현황"
          className="col-span-1 tablet:col-span-1 min-h-120 flex flex-col"
          description={
            <ChartLegend
              items={[
                { label: "안정", colorClass: "bg-info-blue" },
                { label: "주의", colorClass: "bg-info-yellow" },
                { label: "위험", colorClass: "bg-info-red" },
              ]}
            />
          }
        >
          <ErrorBoundary
            FallbackComponent={ChartErrorFallback}
            resetKeys={[budgetData]}
          >
            {isBudgetLoading ? (
              <div className="flex flex-1 items-center justify-center p-8">
                <Skeleton className="h-32 w-full rounded-2xl" />
              </div>
            ) : isBudgetError ? (
              <div className="flex flex-1 items-center justify-center px-4 py-4 text-center font-body2 text-info-red">
                예산 데이터를 불러오지 못했습니다.
              </div>
            ) : budgetData ? (
              <div
                className={twMerge(
                  "flex flex-1 flex-col overflow-y-auto pt-2",
                  budgetData.gauges.length === 1 && "gap-5",
                )}
              >
                {budgetData.gauges.map((gauge, index) => (
                  <div
                    key={gauge.label}
                    className={twMerge(
                      index > 0 &&
                        budgetData.gauges.length > 1 &&
                        "mt-5 border-t border-surface-300 pt-5",
                    )}
                  >
                    <BudgetGaugeChart {...gauge} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center px-4 py-4 text-center font-body2 text-text-muted">
                표시할 예산 데이터가 없습니다.
              </div>
            )}
          </ErrorBoundary>
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
                  ? "bg-info-blue text-surface-100 shadow-Soft"
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
                  ? "bg-info-blue text-surface-100 shadow-Soft"
                  : "bg-surface-100 text-text-muted hover:bg-surface-200",
              )}
            >
              최근 30일
            </button>
          </div>
        }
      >
        <ErrorBoundary
          FallbackComponent={ChartErrorFallback}
          resetKeys={[metricFacts, viewRange]}
        >
          {isMetricFactsLoading ? (
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
        </ErrorBoundary>
      </Card>

      <ErrorBoundary FallbackComponent={ChartErrorFallback}>
        <DashboardAiSummarySection
          provider={platform}
          idPrefix={`platform-ai-${platform.toLowerCase()}`}
        />
      </ErrorBoundary>
    </div>
  );
}
