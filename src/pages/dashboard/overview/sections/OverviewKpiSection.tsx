import { Suspense } from "react";

import type { IApiErrorResponse } from "@/types/common/common";

import { METRIC_REGISTRY as M } from "@/utils/dashboard/metricRegistry";

import type { useOverviewMetrics } from "@/hooks/dashboard/useOverviewMetrics";

import Card from "@/components/common/card/Card";
import StatCard from "@/components/common/card/StatCard";
import ChartLegend from "@/components/common/chart/ChartLegend";
import ChartErrorFallback from "@/components/common/error/ChartErrorFallback";
import { ErrorBoundary } from "@/components/common/error/ErrorBoundary";
import MetricErrorFallback from "@/components/common/error/MetricErrorFallback";
import TrafficChart, {
  TrafficChartDownload,
} from "@/components/dashboard/charts/TrafficChart";
import {
  OverviewKpiCardSkeleton,
  OverviewTrafficChartSkeleton,
} from "@/components/dashboard/overview/skeleton/OverviewSkeleton";

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
      <ErrorBoundary FallbackComponent={MetricErrorFallback}>
        {isKpisError ? (
          <div className="flex items-center justify-center rounded-3xl border border-surface-100/40 bg-surface-100/80 py-8 font-body2 text-info-red">
            {kpisError?.message ??
              "지표 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."}
          </div>
        ) : (
          <div className="grid min-w-0 grid-cols-4 gap-4 tablet:grid-cols-2 tablet:gap-4 grid-mobile-1">
            {isKpisLoading
              ? [0, 1, 2, 3].map((i) => <OverviewKpiCardSkeleton key={i} />)
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
      </ErrorBoundary>

      <Card
        className="flex min-h-120 w-full min-w-0 flex-1 flex-col"
        title="실시간 트래픽 변화"
        description={
          <ChartLegend
            items={[
              { label: M.clicks.label, colorClass: "bg-info-blue" },
              { label: "이상 클릭 탐지", colorClass: "bg-info-red" },
            ]}
          />
        }
        RightElement={<TrafficChartDownload />}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <ErrorBoundary FallbackComponent={ChartErrorFallback}>
            <Suspense fallback={<OverviewTrafficChartSkeleton />}>
              <TrafficChart />
            </Suspense>
          </ErrorBoundary>
        </div>
      </Card>
    </div>
  );
}
