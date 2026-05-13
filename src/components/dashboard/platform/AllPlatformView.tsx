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

import {
  adStatusMock,
  performanceEfficiencyMock,
  roasRankingMock,
} from "@/pages/dashboard/platform/platformDashboard.mock";

interface IAllPlatformViewProps {
  isLoading: boolean;
}

export default function AllPlatformView({ isLoading }: IAllPlatformViewProps) {
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
          {isLoading ? (
            <TopPerformanceListSkeleton />
          ) : (
            <TopPerformanceList rankings={roasRankingMock} />
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
            isLoading ? (
              <BadgeSkeleton className="w-14" />
            ) : (
              <Badge variant="surface" className="text-text-auth-sub">
                총 {adStatusMock.totalCount}개
              </Badge>
            )
          }
          className="flex-1 min-h-67 flex flex-col"
        >
          {isLoading ? (
            <AdStatusChartSkeleton />
          ) : (
            <AdStatusChart data={adStatusMock.providerCount} />
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
          {isLoading ? (
            <PerformanceEfficiencyChartSkeleton />
          ) : (
            <PerformanceEfficiencyChart data={performanceEfficiencyMock} />
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
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <PlatformDetailCardSkeleton key={i} />
            ))
          : performanceEfficiencyMock.map((platform) => (
              <PlatformDetailCard key={platform.provider} data={platform} />
            ))}
      </div>
    </div>
  );
}
