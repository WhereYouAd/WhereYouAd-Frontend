import { usePlatformAdCount } from "@/hooks/dashboard/usePlatformAdCount";
import { usePlatformPerformance } from "@/hooks/dashboard/usePlatformPerformance";
import { usePlatformRoasRankings } from "@/hooks/dashboard/usePlatformRoasRankings";

import Badge from "@/components/common/badge/Badge";
import Card from "@/components/common/card/Card";
import ChartLegend from "@/components/common/chart/ChartLegend";
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

interface IAllPlatformViewProps {
  isLoading: boolean;
}

export default function AllPlatformView({ isLoading }: IAllPlatformViewProps) {
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
            isLoading ? (
              <BadgeSkeleton className="w-28" />
            ) : (
              <Badge variant="surface" className="text-text-auth-sub">
                ROAS 기준 상위 3
              </Badge>
            )
          }
          className="flex-1 min-h-67 flex flex-col"
        >
          {isLoading || isRankingsLoading ? (
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
        </Card>

        {/* 광고 소재 현황 */}
        <Card
          title="광고 소재 현황"
          description={
            <ChartLegend
              className="[&_div]:rounded-none"
              items={[
                { label: "Google", color: "#f9ab00" },
                { label: "NAVER", color: "#03c75a" },
                { label: "Meta", color: "#1877f2" },
              ]}
            />
          }
          RightElement={
            isLoading || isAdStatusLoading ? (
              <BadgeSkeleton className="w-14" />
            ) : adStatus ? (
              <Badge variant="surface" className="text-text-auth-sub">
                총 {adStatus.totalCount}개
              </Badge>
            ) : null
          }
          className="flex-1 min-h-67 flex flex-col"
        >
          {isLoading || isAdStatusLoading ? (
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
        </Card>

        {/* 플랫폼별 성과 효율 비교 */}
        <Card
          title="플랫폼별 성과 효율 비교"
          className="flex-1 min-h-67 flex flex-col pb-1"
          description={
            <ChartLegend
              items={[
                { label: "클릭률", colorClass: "bg-info-blue" },
                { label: "전환율", colorClass: "bg-primary-500" },
                { label: "노출수", colorClass: "bg-primary-300" },
              ]}
            />
          }
        >
          {isLoading || isPerformanceLoading ? (
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
        </Card>
      </div>

      {/* 플랫폼별 실시간 클릭수 비교 */}
      <Card
        title="플랫폼별 실시간 클릭수 비교"
        className="h-120 flex flex-col"
        description={
          <ChartLegend
            items={[
              { label: "Google", color: "#f9ab00" },
              { label: "NAVER", color: "#03c75a" },
              { label: "Meta", color: "#1877f2" },
            ]}
          />
        }
      >
        <div className="flex-1 min-h-0">
          <AllPlatformTrafficChart isLoading={isLoading} />
        </div>
      </Card>

      {/* 개별 플랫폼 상세 */}
      <div className="grid grid-cols-3 tablet:grid-cols-1 gap-6">
        {isLoading || isPerformanceLoading ? (
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
    </div>
  );
}
