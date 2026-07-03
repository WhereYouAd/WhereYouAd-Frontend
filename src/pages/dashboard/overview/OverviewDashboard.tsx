import { useNavigate } from "react-router-dom";

import { useBudget } from "@/hooks/dashboard/useBudget";
import { useOverviewMetrics } from "@/hooks/dashboard/useOverviewMetrics";
import { useOverviewRoasRankings } from "@/hooks/dashboard/useOverviewRoasRankings";

import ChartErrorFallback from "@/components/common/error/ChartErrorFallback";
import { ErrorBoundary } from "@/components/common/error/ErrorBoundary";
import DashboardAiSummarySection from "@/components/dashboard/ai-report/components/DashboardAiSummarySection";
import { getBudgetStatus } from "@/components/dashboard/charts/BudgetGaugeChart";

import { OverviewBudgetSection } from "./sections/OverviewBudgetSection";
import { OverviewKpiSection } from "./sections/OverviewKpiSection";
import { OverviewPlatformSection } from "./sections/OverviewPlatformSection";

export default function OverviewDashboard() {
  const navigate = useNavigate();

  const {
    data: kpis,
    isLoading: isKpisLoading,
    isError: isKpisError,
    error: kpisError,
  } = useOverviewMetrics();
  const {
    data: budget,
    isLoading: isBudgetLoading,
    isError: isBudgetError,
    error: budgetError,
  } = useBudget();
  const {
    data: roasRankingsData,
    isLoading: isRankingsLoading,
    isError: isRankingsError,
    error: rankingsError,
  } = useOverviewRoasRankings();

  const budgetPct =
    budget && budget.totalBudget > 0
      ? Math.round((budget.spent / budget.totalBudget) * 100)
      : 0;
  const budgetStatus =
    budget && !isBudgetLoading
      ? getBudgetStatus(
          budgetPct,
          budget.warningThreshold,
          budget.dangerThreshold,
        )
      : null;

  return (
    <section className="flex w-full min-w-0 flex-col gap-6">
      <div className="grid w-full min-w-0 grid-cols-4 items-stretch gap-6 tablet:grid-cols-1 tablet:gap-6">
        <OverviewKpiSection
          kpis={kpis}
          isKpisLoading={isKpisLoading}
          isKpisError={isKpisError}
          kpisError={kpisError}
        />
        <OverviewBudgetSection
          budget={budget}
          isBudgetLoading={isBudgetLoading}
          isBudgetError={isBudgetError}
          budgetError={budgetError}
          budgetStatus={budgetStatus}
        />
      </div>

      <ErrorBoundary
        FallbackComponent={ChartErrorFallback}
        resetKeys={[roasRankingsData]}
        onError={(error, info) =>
          console.error("[OverviewPlatformSection]", error, info.componentStack)
        }
      >
        <OverviewPlatformSection
          rankings={roasRankingsData}
          isRankingsLoading={isRankingsLoading}
          isRankingsError={isRankingsError}
          rankingsError={rankingsError}
          onNavigate={() => navigate("/platform")}
        />
      </ErrorBoundary>

      <ErrorBoundary
        FallbackComponent={ChartErrorFallback}
        onError={(error, info) =>
          console.error(
            "[DashboardAiSummarySection]",
            error,
            info.componentStack,
          )
        }
      >
        <DashboardAiSummarySection
          provider="ALL"
          idPrefix="overview-ai-summary"
        />
      </ErrorBoundary>
    </section>
  );
}
