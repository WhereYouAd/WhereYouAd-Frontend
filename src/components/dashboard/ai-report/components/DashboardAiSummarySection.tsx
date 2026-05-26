import { useCallback } from "react";

import type { TAiAnalysisProvider } from "@/types/dashboard/aiAnalysis";
import { PLATFORM_MAP } from "@/types/dashboard/platform";
import { formatAiAnalysisPeriodLabel } from "@/constants/dashboard/overviewMetricsRange";

import { useAiAnalysisReport } from "@/hooks/dashboard/useAiAnalysisReport";

import AiSummaryCard from "./AiSummaryCard";

function getAiSummaryTitle(provider: TAiAnalysisProvider): string {
  if (provider === "ALL") return "통합 광고 성과 AI 요약";
  return `${PLATFORM_MAP[provider]} 광고 성과 AI 요약`;
}

function getAiSummaryDocumentTitle(provider: TAiAnalysisProvider): string {
  if (provider === "ALL") return "통합 광고 성과 AI 요약 보고서";
  return `${PLATFORM_MAP[provider]} 광고 성과 AI 요약 보고서`;
}

type TDashboardAiSummarySectionProps = {
  provider: TAiAnalysisProvider;
  idPrefix: string;
  title?: string;
};

export default function DashboardAiSummarySection({
  provider,
  idPrefix,
  title,
}: TDashboardAiSummarySectionProps) {
  const {
    reportData,
    requestAnalysis,
    reset,
    isLoading,
    loadingMessage,
    isError,
    errorMessage,
  } = useAiAnalysisReport(provider);

  const handleExpand = useCallback(() => {
    if (!reportData && !isLoading && !isError) {
      requestAnalysis();
    }
  }, [reportData, isLoading, isError, requestAnalysis]);

  const handleRetry = useCallback(() => {
    reset();
    requestAnalysis();
  }, [reset, requestAnalysis]);

  return (
    <AiSummaryCard
      data={reportData}
      isLoading={isLoading}
      loadingMessage={loadingMessage}
      isError={isError}
      errorMessage={errorMessage}
      onExpand={handleExpand}
      onRetry={handleRetry}
      title={title ?? getAiSummaryTitle(provider)}
      idPrefix={idPrefix}
      print={{ documentTitle: getAiSummaryDocumentTitle(provider) }}
      periodLabel={formatAiAnalysisPeriodLabel()}
    />
  );
}
