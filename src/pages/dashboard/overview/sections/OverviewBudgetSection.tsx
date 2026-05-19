import type { IApiErrorResponse } from "@/types/common/common";

import type { useOverviewBudget } from "@/hooks/dashboard/useOverviewBudget";

import Badge from "@/components/common/badge/Badge";
import Card from "@/components/common/card/Card";
import ChartLegend, {
  type IChartLegendItem,
} from "@/components/common/chart/ChartLegend";
import type { getBudgetStatus } from "@/components/dashboard/charts/BudgetGaugeChart";
import BudgetGaugeChart, {
  statusBadgeVariant,
} from "@/components/dashboard/charts/BudgetGaugeChart";
import { OverviewBudgetGaugeSkeleton } from "@/components/dashboard/overview/skeleton/OverviewSkeleton";

import OverviewCampaignSnapshotCard from "./OverviewCampaignSnapshotCard";

const budgetStatusLegendItems: IChartLegendItem[] = [
  { label: "안정", colorClass: "bg-info-blue" },
  { label: "주의", colorClass: "bg-info-yellow" },
  { label: "위험", colorClass: "bg-info-red" },
];

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
      <div className="flex min-h-0 flex-1 flex-col">
        <Card
          className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden pb-4!"
          title="예산 소진 현황"
          description={
            <ChartLegend
              className="flex-wrap gap-x-4 gap-y-1 [&_span]:text-text-muted"
              items={budgetStatusLegendItems}
            />
          }
          RightElement={
            budgetStatus ? (
              <Badge
                variant={statusBadgeVariant[budgetStatus]}
                className="px-2"
              >
                {budgetStatus}
              </Badge>
            ) : undefined
          }
        >
          <div className="flex min-h-0 flex-1 flex-col">
            {isBudgetError ? (
              <div className="flex flex-1 items-center justify-center px-4 py-4 text-center font-body2 text-info-red">
                {budgetError?.message ?? (
                  <>
                    예산 데이터를 불러오지 못했습니다.
                    <br />
                    잠시 후 다시 시도해 주세요.
                  </>
                )}
              </div>
            ) : isBudgetLoading ? (
              <OverviewBudgetGaugeSkeleton />
            ) : budget ? (
              <BudgetGaugeChart {...budget} />
            ) : null}
          </div>
        </Card>
      </div>

      <div className="shrink-0">
        <OverviewCampaignSnapshotCard />
      </div>
    </div>
  );
}
