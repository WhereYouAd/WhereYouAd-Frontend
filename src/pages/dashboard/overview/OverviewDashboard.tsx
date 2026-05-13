import { type ReactNode, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "sonner";

import { printAsPdf } from "@/utils/download";

import { useOverviewBudget } from "@/hooks/dashboard/useOverviewBudget";
import { useOverviewMetrics } from "@/hooks/dashboard/useOverviewMetrics";
import { useOverviewRoasRankings } from "@/hooks/dashboard/useOverviewRoasRankings";

import { getBudgetStatus } from "@/components/dashboard/charts/BudgetGaugeChart";

import { OverviewAiDrawer } from "./OverviewAiDrawer";
import { OverviewBudgetSection } from "./OverviewBudgetSection";
import { OverviewKpiSection } from "./OverviewKpiSection";
import { OverviewPlatformSection } from "./OverviewPlatformSection";

import SparkleCircleIcon from "@/assets/icon/ai/sparkle-circle.svg?react";
import AiButtonSvg from "@/assets/logo/service-logo/ai-요약버튼.svg?react";

type TDashboardHeaderContext = {
  setHeaderRight?: (node: ReactNode | null) => void;
};

export default function OverviewDashboard() {
  const navigate = useNavigate();
  const { setHeaderRight } = useOutletContext<TDashboardHeaderContext>();
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

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

  useEffect(() => {
    if (!setHeaderRight) return;

    setHeaderRight(
      <button
        type="button"
        onClick={() => setIsAiPanelOpen(true)}
        className="group relative -mr-2 inline-flex h-8 cursor-pointer items-center justify-center overflow-hidden rounded-2xl px-1 outline-none focus-visible:ring-2 focus-visible:ring-primary-300/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-100"
        aria-label="AI 요약하기"
      >
        <div className="pointer-events-none absolute inset-0 z-20 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-surface-100/80 to-transparent mix-blend-overlay group-hover:animate-[shimmer_1.2s_ease-out]" />
        <div className="relative z-10">
          <span className="sm:hidden">
            <SparkleCircleIcon className="h-5 w-5 fill-current text-primary-500" />
          </span>
          <span className="hidden sm:block">
            <AiButtonSvg className="h-6 w-auto [&>path:nth-of-type(4)]:transition-transform [&>path:nth-of-type(4)]:duration-300 group-hover:[&>path:nth-of-type(4)]:translate-x-0.5 [&>path:nth-of-type(5)]:transition-transform [&>path:nth-of-type(5)]:duration-300 group-hover:[&>path:nth-of-type(5)]:translate-x-1" />
          </span>
        </div>
      </button>,
    );

    return () => setHeaderRight(null);
  }, [setHeaderRight, setIsAiPanelOpen]);

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

      <OverviewAiDrawer
        isOpen={isAiPanelOpen}
        onClose={() => setIsAiPanelOpen(false)}
        onShareLink={() => {
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => toast.success("링크가 복사되었습니다."))
            .catch(() => toast.error("링크 복사에 실패했습니다."));
        }}
        onDownloadPdf={() => printAsPdf("ai-report-printing")}
      />
    </section>
  );
}
