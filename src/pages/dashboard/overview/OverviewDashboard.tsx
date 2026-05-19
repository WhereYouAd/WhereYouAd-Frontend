import { useNavigate } from "react-router-dom";

import { useOverviewBudget } from "@/hooks/dashboard/useOverviewBudget";
import { useOverviewMetrics } from "@/hooks/dashboard/useOverviewMetrics";
import { useOverviewRoasRankings } from "@/hooks/dashboard/useOverviewRoasRankings";

import AiSummaryCard from "@/components/dashboard/ai-report/components/AiSummaryCard";
import { getBudgetStatus } from "@/components/dashboard/charts/BudgetGaugeChart";

import { overviewAiReportMockData } from "./mock/aiReport.mock";
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
  } = useOverviewBudget();
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

      <OverviewPlatformSection
        rankings={roasRankingsData}
        isRankingsLoading={isRankingsLoading}
        isRankingsError={isRankingsError}
        rankingsError={rankingsError}
        onNavigate={() => navigate("/platform")}
      />

      <AiSummaryCard
        data={overviewAiReportMockData}
        idPrefix="overview-ai-summary"
      />
    </section>
  );
}
