import type { ReactNode } from "react";

import type { TProviderType } from "@/types/dashboard/provider";
import {
  PLATFORM_CHART_COLORS,
  PLATFORM_MAP,
  PROVIDER_TYPES,
} from "@/types/dashboard/provider";

import { METRIC_REGISTRY as M } from "@/utils/dashboard/metricRegistry";

import { usePlatformAdCount } from "@/hooks/dashboard/usePlatformAdCount";
import { usePlatformPerformance } from "@/hooks/dashboard/usePlatformPerformance";
import { usePlatformRoasRankings } from "@/hooks/dashboard/usePlatformRoasRankings";

import Badge from "@/components/common/badge/Badge";
import Card from "@/components/common/card/Card";
import ChartLegend from "@/components/common/chart/ChartLegend";
import ChartErrorFallback from "@/components/common/error/ChartErrorFallback";
import { ErrorBoundary } from "@/components/common/error/ErrorBoundary";
import AdStatusChart from "@/components/dashboard/charts/AdStatusChart";
import PerformanceEfficiencyChart from "@/components/dashboard/charts/PerformanceEfficiencyChart";
import AllPlatformTrafficChart from "@/components/dashboard/platform/AllPlatformTrafficChart";
import PlatformDetailCard from "@/components/dashboard/platform/PlatformDetailCard";
import PlatformTrafficChartDownload from "@/components/dashboard/platform/PlatformTrafficChartDownload";
import {
  AdStatusChartSkeleton,
  BadgeSkeleton,
  PerformanceEfficiencyChartSkeleton,
  PlatformDetailCardSkeleton,
  TopPerformanceListSkeleton,
} from "@/components/dashboard/platform/skeleton/PlatformSkeleton";
import TopPerformanceList from "@/components/dashboard/platform/TopPerformanceList";

import GoogleLogo from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import MetaLogo from "@/assets/logo/social-logo/circle/meta-circle.svg?react";
import NaverLogo from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

const platformChartLegendItems = PROVIDER_TYPES.map((provider) => ({
  label: PLATFORM_MAP[provider],
  color: PLATFORM_CHART_COLORS[provider],
}));

const PLATFORM_LOGOS: Record<TProviderType, ReactNode> = {
  GOOGLE: <GoogleLogo className="w-10 h-8" />,
  NAVER: <NaverLogo className="w-10 h-8" />,
  META: <MetaLogo className="w-10 h-8" />,
};

function PlatformDetailErrorCard({ provider }: { provider: TProviderType }) {
  return (
    <Card className="min-w-0 flex-1 p-7">
      <div className="mb-8 flex items-center gap-2">
        <div className="shrink-0">{PLATFORM_LOGOS[provider]}</div>
        <h3 className="truncate font-heading4 text-text-title">
          {PLATFORM_MAP[provider]}
        </h3>
      </div>
      <div className="flex min-h-40 items-center justify-center font-body2 text-text-sub">
        데이터를 불러오지 못했습니다.
      </div>
    </Card>
  );
}

export default function AllPlatformView() {
  const {
    data: roasRankings,
    isLoading: isRankingsLoading,
    isError: isRankingsError,
  } = usePlatformRoasRankings();

  const {
    data: adStatus,
    isLoading: isAdStatusLoading,
    isError: isAdStatusError,
  } = usePlatformAdCount();

  const {
    data: performanceData,
    isLoading: isPerformanceLoading,
    isError: isPerformanceError,
  } = usePlatformPerformance();

  const platformPerformance = performanceData?.platforms;
  const failedProviders = performanceData?.failedProviders ?? [];
  const hasPartialFailure = failedProviders.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-3 tablet:grid-cols-1 gap-6">
        {/* 성과 우수 플랫폼 */}
        <Card
          title="성과 우수 플랫폼"
          RightElement={
            <Badge variant="surface" className="text-text-auth-sub">
              ROAS 기준 상위 3
            </Badge>
          }
          className="flex-1 min-h-67 flex flex-col"
        >
          <ErrorBoundary
            FallbackComponent={ChartErrorFallback}
            resetKeys={[roasRankings]}
          >
            {isRankingsLoading ? (
              <TopPerformanceListSkeleton />
            ) : isRankingsError || !roasRankings ? (
              <div className="flex flex-1 items-center justify-center font-body2 text-text-sub">
                데이터를 불러오지 못했습니다.
              </div>
            ) : roasRankings.length === 0 ? (
              <div className="flex flex-1 items-center justify-center font-body2 text-text-sub">
                표시할 순위 데이터가 없습니다.
              </div>
            ) : (
              <TopPerformanceList rankings={roasRankings} />
            )}
          </ErrorBoundary>
        </Card>

        {/* 광고 소재 현황 */}
        <Card
          title="광고 소재 현황"
          description={
            <ChartLegend
              className="[&_div]:rounded-none"
              items={platformChartLegendItems}
            />
          }
          RightElement={
            isAdStatusLoading ? (
              <BadgeSkeleton className="w-14" />
            ) : adStatus ? (
              <Badge variant="surface" className="text-text-auth-sub">
                총 {adStatus.totalCount}개
              </Badge>
            ) : null
          }
          className="flex-1 min-h-67 flex flex-col"
        >
          <ErrorBoundary
            FallbackComponent={ChartErrorFallback}
            resetKeys={[adStatus]}
          >
            {isAdStatusLoading ? (
              <AdStatusChartSkeleton />
            ) : isAdStatusError || !adStatus ? (
              <div className="flex flex-1 items-center justify-center font-body2 text-text-sub">
                데이터를 불러오지 못했습니다.
              </div>
            ) : adStatus.providerCount.length === 0 ? (
              <div className="flex flex-1 items-center justify-center font-body2 text-text-sub">
                표시할 광고 소재가 없습니다.
              </div>
            ) : (
              <AdStatusChart data={adStatus.providerCount} />
            )}
          </ErrorBoundary>
        </Card>

        {/* 플랫폼별 성과 효율 비교 */}
        <Card
          title="플랫폼별 성과 효율 비교"
          className="flex-1 min-h-67 flex flex-col pb-1"
          description={
            <ChartLegend
              items={[
                { label: M.ctr.label, colorClass: "bg-info-blue" },
                { label: M.conversion.label, colorClass: "bg-primary-500" },
                { label: M.impressions.label, colorClass: "bg-primary-300" },
              ]}
            />
          }
        >
          <ErrorBoundary
            FallbackComponent={ChartErrorFallback}
            resetKeys={[platformPerformance]}
          >
            {isPerformanceLoading ? (
              <PerformanceEfficiencyChartSkeleton />
            ) : isPerformanceError || !platformPerformance ? (
              <div className="flex flex-1 items-center justify-center font-body2 text-text-sub">
                데이터를 불러오지 못했습니다.
              </div>
            ) : platformPerformance.length === 0 ? (
              <div className="flex flex-1 items-center justify-center font-body2 text-text-sub">
                표시할 성과 데이터가 없습니다.
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                {hasPartialFailure ? (
                  <p className="mb-2 font-caption text-text-muted">
                    일부 플랫폼 성과를 불러오지 못했습니다.
                  </p>
                ) : null}
                <PerformanceEfficiencyChart data={platformPerformance} />
              </div>
            )}
          </ErrorBoundary>
        </Card>
      </div>

      {/* 플랫폼별 실시간 클릭수 비교 */}
      <Card
        title="플랫폼별 실시간 클릭수 비교"
        className="h-120 flex flex-col"
        description={<ChartLegend items={platformChartLegendItems} />}
        RightElement={<PlatformTrafficChartDownload />}
      >
        <div className="flex-1 min-h-0">
          <ErrorBoundary FallbackComponent={ChartErrorFallback}>
            <AllPlatformTrafficChart />
          </ErrorBoundary>
        </div>
      </Card>

      {/* 개별 플랫폼 상세 */}
      <ErrorBoundary
        FallbackComponent={ChartErrorFallback}
        resetKeys={[platformPerformance, failedProviders]}
      >
        <div className="grid grid-cols-3 tablet:grid-cols-1 gap-6">
          {isPerformanceLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <PlatformDetailCardSkeleton key={i} />
            ))
          ) : isPerformanceError || !platformPerformance ? (
            <div className="col-span-3 tablet:col-span-1 flex items-center justify-center font-body2 text-text-sub py-16">
              데이터를 불러오지 못했습니다.
            </div>
          ) : (
            PROVIDER_TYPES.map((provider) => {
              const data = platformPerformance.find(
                (platform) => platform.provider === provider,
              );
              if (data) {
                return <PlatformDetailCard key={provider} data={data} />;
              }
              if (failedProviders.includes(provider)) {
                return (
                  <PlatformDetailErrorCard key={provider} provider={provider} />
                );
              }
              return null;
            })
          )}
        </div>
      </ErrorBoundary>
    </div>
  );
}
