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
import {
  AdStatusChartSkeleton,
  BadgeSkeleton,
  PerformanceEfficiencyChartSkeleton,
  PlatformDetailCardSkeleton,
  TopPerformanceListSkeleton,
} from "@/components/dashboard/platform/skeleton/PlatformSkeleton";
import TopPerformanceList from "@/components/dashboard/platform/TopPerformanceList";

const platformChartLegendItems = PROVIDER_TYPES.map((provider) => ({
  label: PLATFORM_MAP[provider],
  color: PLATFORM_CHART_COLORS[provider],
}));

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
    data: platformPerformance,
    isLoading: isPerformanceLoading,
    isError: isPerformanceError,
  } = usePlatformPerformance();

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
              <PerformanceEfficiencyChart data={platformPerformance} />
            )}
          </ErrorBoundary>
        </Card>
      </div>

      {/* 플랫폼별 실시간 클릭수 비교 */}
      <Card
        title="플랫폼별 실시간 클릭수 비교"
        className="h-120 flex flex-col"
        description={<ChartLegend items={platformChartLegendItems} />}
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
        resetKeys={[platformPerformance]}
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
          ) : platformPerformance.length === 0 ? (
            <div className="col-span-3 tablet:col-span-1 flex items-center justify-center font-body2 text-text-sub py-16">
              표시할 플랫폼 데이터가 없습니다.
            </div>
          ) : (
            platformPerformance.map((platform) => (
              <PlatformDetailCard key={platform.provider} data={platform} />
            ))
          )}
        </div>
      </ErrorBoundary>
    </div>
  );
}
