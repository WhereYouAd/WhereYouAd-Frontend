import { useCallback, useEffect, useMemo, useRef } from "react";

import type { TAiAnalysisProvider } from "@/types/dashboard/aiAnalysis";
import { PLATFORM_MAP } from "@/types/dashboard/provider";
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
    isLoading,
    isCheckingSharedReport,
    hasUsableSharedReport,
    sharedReportCreatedAt,
    loadingMessage,
    isError,
    errorMessage,
  } = useAiAnalysisReport(provider);

  /** ref로 유지해 fallback effect deps에 포함하지 않음 */
  const hasUsableSharedReportRef = useRef(false);
  hasUsableSharedReportRef.current = hasUsableSharedReport;

  const periodLabel = useMemo(() => {
    const base = formatAiAnalysisPeriodLabel();
    if (!sharedReportCreatedAt) return base;
    const date = sharedReportCreatedAt.slice(0, 10).replaceAll("-", ".");
    return `${base} · 팀 공유 분석 (${date})`;
  }, [sharedReportCreatedAt]);

  /** 공유 조회 중에 카드를 펼쳤을 때 POST를 보류했음을 기록 */
  const pendingExpandRef = useRef(false);

  const handleExpand = useCallback(() => {
    if (!reportData && !isLoading && !isError) {
      requestAnalysis();
    } else if (isCheckingSharedReport) {
      pendingExpandRef.current = true;
    }
  }, [reportData, isLoading, isError, isCheckingSharedReport, requestAnalysis]);

  /** 공유 조회가 끝났을 때 결과가 없으면 POST fallback 실행 */
  useEffect(() => {
    if (
      pendingExpandRef.current &&
      !isCheckingSharedReport &&
      !reportData &&
      !isLoading &&
      !isError &&
      !hasUsableSharedReportRef.current
    ) {
      pendingExpandRef.current = false;
      requestAnalysis();
    }
  }, [isCheckingSharedReport, reportData, isLoading, isError, requestAnalysis]);

  const handleRetry = useCallback(() => {
    requestAnalysis();
  }, [requestAnalysis]);

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
      periodLabel={periodLabel}
    />
  );
}
