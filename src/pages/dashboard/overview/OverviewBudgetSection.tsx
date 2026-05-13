import type { IApiErrorResponse } from "@/types/common/common";

import type { useOverviewBudget } from "@/hooks/dashboard/useOverviewBudget";

import Badge from "@/components/common/badge/Badge";
import Card from "@/components/common/card/Card";
import ChartLegend, {
  type IChartLegendItem,
} from "@/components/common/chart/ChartLegend";
import { Skeleton } from "@/components/common/skeleton/Skeleton";
import type { getBudgetStatus } from "@/components/dashboard/charts/BudgetGaugeChart";
import BudgetGaugeChart, {
  statusBadgeVariant,
} from "@/components/dashboard/charts/BudgetGaugeChart";

import OverviewCampaignSnapshotCard from "@/pages/dashboard/overview/OverviewCampaignSnapshotCard";

const budgetStatusLegendItems: IChartLegendItem[] = [
  { label: "안정", colorClass: "bg-status-green" },
  { label: "주의", colorClass: "bg-status-yellow" },
  { label: "위험", colorClass: "bg-status-red" },
];

function BudgetGaugeSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 pt-1">
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
      <div className="flex shrink-0 flex-col gap-3">
        <div className="flex flex-col gap-1 rounded-2xl border border-bg-disabled/25 bg-bg-surface/40 p-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-36" />
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-chart-inactive px-5 py-4">
          <Skeleton className="size-5 shrink-0 rounded-full" />
          <Skeleton className="h-10 flex-1 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function OverviewBudgetSection({
  budget,
  isBudgetLoading,
  isBudgetError,
  budgetError,
  budgetStatus,
}: {
  budget: ReturnType<typeof useOverviewBudget>["data"];
  isBudgetLoading: boolean;
  isBudgetError: boolean;
  budgetError: IApiErrorResponse | null;
  budgetStatus: ReturnType<typeof getBudgetStatus> | null;
}) {
  return (
    <div className="col-span-1 flex h-full min-h-0 min-w-0 flex-col gap-3 tablet:col-span-1">
      <div className="flex min-h-0 flex-[2_1_0%] flex-col">
        <Card
          className="flex h-full min-h-0 min-w-0 flex-col pb-4!"
          title="예산 소진 현황"
          description={
            <ChartLegend
              className="flex-wrap gap-x-4 gap-y-1 [&_span]:font-medium [&_span]:text-text-muted"
              items={budgetStatusLegendItems}
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
              <BudgetGaugeSkeleton />
            ) : budget ? (
              <BudgetGaugeChart {...budget} />
            ) : null}
          </div>
        </Card>
      </div>

      <div className="flex min-h-60 flex-[1_1_0%] flex-col overflow-hidden">
        <OverviewCampaignSnapshotCard className="h-full" />
      </div>
    </div>
  );
}
