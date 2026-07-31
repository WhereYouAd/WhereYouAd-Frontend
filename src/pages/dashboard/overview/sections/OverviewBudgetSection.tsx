import type { IApiErrorResponse } from "@/types/common/common";

import type { useBudget } from "@/hooks/dashboard/useBudget";

import Card from "@/components/common/card/Card";
import ChartLegend, {
  type IChartLegendItem,
} from "@/components/common/chart/ChartLegend";
import ChartErrorFallback from "@/components/common/error/ChartErrorFallback";
import { ErrorBoundary } from "@/components/common/error/ErrorBoundary";
import BudgetGaugeChart from "@/components/dashboard/charts/BudgetGaugeChart";
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
}: {
  budget: ReturnType<typeof useBudget>["data"];
  isBudgetLoading: boolean;
  isBudgetError: boolean;
  budgetError: IApiErrorResponse | null;
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
        >
          <div className="flex min-h-0 flex-1 flex-col">
            <ErrorBoundary
              FallbackComponent={ChartErrorFallback}
              resetKeys={[budget]}
            >
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
                <div
                  className={
                    budget.gauges.length > 1
                      ? "flex min-h-0 flex-1 flex-col overflow-y-auto"
                      : "flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto"
                  }
                >
                  {budget.gauges.map((gauge, index) => (
                    <div
                      key={gauge.label}
                      className={
                        index > 0 && budget.gauges.length > 1
                          ? "mt-5 border-t border-surface-300 pt-5"
                          : undefined
                      }
                    >
                      <BudgetGaugeChart {...gauge} />
                    </div>
                  ))}
                </div>
              ) : null}
            </ErrorBoundary>
          </div>
        </Card>
      </div>

      <div className="shrink-0">
        <OverviewCampaignSnapshotCard />
      </div>
    </div>
  );
}
