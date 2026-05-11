import { Suspense } from "react";

import type { IApiErrorResponse } from "@/types/common/common";

import type { useOverviewMetrics } from "@/hooks/dashboard/useOverviewMetrics";

import Card from "@/components/common/card/Card";
import StatCard from "@/components/common/card/StatCard";
import ChartLegend from "@/components/common/chart/ChartLegend";
import { Skeleton } from "@/components/common/skeleton/Skeleton";
import TrafficChart, {
  TrafficChartDownload,
} from "@/components/dashboard/charts/TrafficChart";

function KpiSkeletonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-white/40 bg-white/80 px-7 py-5 shadow-card backdrop-blur-sm">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-6 w-14 rounded-full" />
    </div>
  );
}

export function OverviewKpiSection({
  kpis,
  isKpisLoading,
  isKpisError,
  kpisError,
}: {
  kpis: ReturnType<typeof useOverviewMetrics>["data"];
  isKpisLoading: boolean;
  isKpisError: boolean;
  kpisError: IApiErrorResponse | null;
}) {
  const kpiList = kpis ?? [];

  return (
    <div className="col-span-3 flex h-full min-h-0 min-w-0 flex-col gap-6 tablet:col-span-1">
      {isKpisError ? (
        <div className="flex items-center justify-center rounded-[24px] border border-white/40 bg-white/80 py-8 font-body2 text-status-red">
          {kpisError?.message ??
            "지표 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."}
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-4 gap-4 tablet:grid-cols-2 tablet:gap-4">
          {isKpisLoading
            ? [0, 1, 2, 3].map((i) => <KpiSkeletonCard key={i} />)
            : kpiList.map((kpi) => (
                <StatCard
                  key={`d-${kpi.title}`}
                  {...kpi}
                  className="gap-3 py-5"
                  compact
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
  );
}
