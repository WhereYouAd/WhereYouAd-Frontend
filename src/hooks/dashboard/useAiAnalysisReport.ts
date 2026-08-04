import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { IApiErrorResponse } from "@/types/common/common";
import type {
  IAnalysisRequest,
  IAnalysisResponse,
  TAiAnalysisProvider,
} from "@/types/dashboard/aiAnalysis";
import { getAiAnalysisDateRange } from "@/constants/dashboard/overviewMetricsRange";

import { useCoreMutation, useCoreQuery } from "@/hooks/customQuery";

import {
  getAiReportByAccessToken,
  getOrgAiReports,
  requestAiAnalysis,
} from "@/api/dashboard/aiAnalysis";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

/** 폴링 간격 및 최대 대기(ms) */
const POLL_INTERVAL_MS = 1500;
const MAX_POLL_MS = 90_000;
const AI_REPORT_GC_TIME_MS = 5 * 60 * 1000;
const AI_ERROR_FALLBACK =
  "AI 요약을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
const WORKSPACE_REQUIRED_MESSAGE =
  "워크스페이스를 선택한 뒤 다시 시도해 주세요.";

/** 분석 요청 시 body 일부만 덮어쓸 때 */
export type TRequestAiAnalysisParams = Partial<IAnalysisRequest>;

/** AI 요약: POST 요청 → accessToken → GET 폴링 → reportData */
export function useAiAnalysisReport(provider: TAiAnalysisProvider = "ALL") {
  const queryClient = useQueryClient();
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [pollStartedAt, setPollStartedAt] = useState<number | null>(null);
  const [workspaceErrorShown, setWorkspaceErrorShown] = useState(false);
  /** true면 조직 공유 리포트 조회를 건너뛰고 POST 플로우로 직행 (명시적 요청) */
  const [skipSharedLookup, setSkipSharedLookup] = useState(false);
  /** 공유 리포트 채택 시 해당 리포트의 생성일 (ISO 문자열) */
  const [sharedReportCreatedAt, setSharedReportCreatedAt] = useState<
    string | null
  >(null);

  /** 재요청 전 상태 초기화 */
  const reset = useCallback(() => {
    setAccessToken(null);
    setPollStartedAt(null);
    setWorkspaceErrorShown(false);
    setSkipSharedLookup(false);
    setSharedReportCreatedAt(null);
  }, []);

  useEffect(() => {
    reset();
  }, [provider, orgId, reset]);

  useEffect(() => {
    return () => {
      void queryClient.removeQueries({
        queryKey: QUERY_KEYS.ai.report(provider, orgId),
      });
      void queryClient.removeQueries({
        queryKey: QUERY_KEYS.ai.reportList(provider, orgId),
      });
    };
  }, [provider, orgId]);

  /* 조직 공유 최신 리포트 우선 조회 */
  const sharedReportListQuery = useCoreQuery(
    QUERY_KEYS.ai.reportList(provider, orgId),
    () =>
      getOrgAiReports(orgId!, {
        reportType: provider === "ALL" ? undefined : provider,
        size: 1,
      }),
    {
      enabled: !!orgId && !skipSharedLookup && !accessToken,
      staleTime: 0,
      gcTime: AI_REPORT_GC_TIME_MS,
    },
  );

  /* 조회된 공유 리포트가 있으면 POST 없이 그 accessToken으로 바로 렌더링 */
  useEffect(() => {
    if (skipSharedLookup || accessToken) return;
    if (!sharedReportListQuery.isSuccess) return;

    const latest = sharedReportListQuery.data.reports[0];
    /** 과거에 실패한 리포트는 채택하지 않고 미조회 상태로 둔다 (펼치면 새 POST로 폴백) */
    if (!latest || latest.status === "FAILED") return;

    setAccessToken(latest.reportAccessToken);
    setSharedReportCreatedAt(latest.createdAt);
    setPollStartedAt(Date.now());
  }, [
    accessToken,
    skipSharedLookup,
    sharedReportListQuery.isSuccess,
    sharedReportListQuery.data,
  ]);

  /** POST /analysis — accessToken 발급 */
  const requestMutation = useCoreMutation(
    (params: TRequestAiAnalysisParams) => {
      const defaultRange = getAiAnalysisDateRange();
      const body: IAnalysisRequest = {
        startDate: params.startDate ?? defaultRange.startDate,
        endDate: params.endDate ?? defaultRange.endDate,
        provider: params.provider ?? provider,
      };

      return requestAiAnalysis(orgId!, body);
    },
    {
      userOnSuccess: (token) => {
        setAccessToken(token);
        setPollStartedAt(Date.now());
        void queryClient.fetchQuery({
          queryKey: QUERY_KEYS.ai.report(provider, orgId),
          queryFn: () => getAiReportByAccessToken(token),
          staleTime: 0,
        });
      },
      userOnError: (error) => {
        toast.error((error as IApiErrorResponse).message ?? AI_ERROR_FALLBACK);
      },
    },
  );

  /** GET /reports/{token} — PENDING이면 주기적으로 재조회 */
  const reportQuery = useCoreQuery(
    QUERY_KEYS.ai.report(provider, orgId),
    () => getAiReportByAccessToken(accessToken!),
    {
      enabled: !!accessToken,
      staleTime: 0,
      gcTime: AI_REPORT_GC_TIME_MS,
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        if (status !== "PENDING") return false;

        const started = pollStartedAt ?? Date.now();
        if (Date.now() - started > MAX_POLL_MS) return false;

        return POLL_INTERVAL_MS;
      },
    },
  );

  const reportStatus = reportQuery.data?.status;
  const isEmptySuccess =
    reportStatus === "SUCCESS" && reportQuery.data?.result == null;

  const reportData: IAnalysisResponse | undefined =
    reportStatus === "SUCCESS" && reportQuery.data?.result
      ? reportQuery.data.result
      : undefined;

  const pollTimedOut = useMemo(() => {
    if (!accessToken || reportStatus !== "PENDING") return false;
    if (pollStartedAt === null) return false;
    return Date.now() - pollStartedAt > MAX_POLL_MS;
  }, [accessToken, pollStartedAt, reportStatus]);

  /** 카드 펼치기 등에서 호출 */
  const requestAnalysis = useCallback(
    (params?: TRequestAiAnalysisParams) => {
      if (!orgId) {
        reset();
        setWorkspaceErrorShown(true);
        toast.error(WORKSPACE_REQUIRED_MESSAGE);
        return;
      }
      reset();
      /** 명시적 POST 요청은 조직 공유 리포트 조회 결과로 덮어써지지 않도록 건너뜀 */
      setSkipSharedLookup(true);
      requestMutation.mutate(params ?? {});
    },
    [orgId, reset, requestMutation],
  );

  const isSubmitting = requestMutation.isPending;
  const isCheckingSharedReport = sharedReportListQuery.isLoading;
  const isPolling =
    !!accessToken && reportStatus === "PENDING" && !pollTimedOut;

  const isLoading = isCheckingSharedReport || isSubmitting || isPolling;

  const queryError = reportQuery.error as IApiErrorResponse | null;
  const isWorkspaceMissing = !orgId && workspaceErrorShown;

  const isAnalysisFailed = reportStatus === "FAILED";

  const isError =
    isWorkspaceMissing ||
    requestMutation.isError ||
    reportQuery.isError ||
    isAnalysisFailed ||
    isEmptySuccess ||
    pollTimedOut;

  const loadingMessage = useMemo(() => {
    if (isCheckingSharedReport) return "이전 분석 결과를 확인하고 있어요…";
    if (isSubmitting) return "분석을 요청하고 있어요…";
    if (isPolling)
      return "AI가 광고 성과를 분석 중이에요. 보통 10~30초 걸려요.";
    return null;
  }, [isCheckingSharedReport, isSubmitting, isPolling]);

  const errorMessage = useMemo(() => {
    if (isWorkspaceMissing) return WORKSPACE_REQUIRED_MESSAGE;
    if (pollTimedOut) {
      return "AI 분석이 예상보다 오래 걸리고 있습니다. 잠시 후 다시 시도해 주세요.";
    }
    if (isEmptySuccess) {
      return "AI 분석 결과를 받지 못했습니다. 잠시 후 다시 시도해 주세요.";
    }
    if (reportStatus === "FAILED") {
      return "AI 분석에 실패했습니다. 잠시 후 다시 시도해 주세요.";
    }
    if (requestMutation.error) {
      return (
        (requestMutation.error as IApiErrorResponse).message ??
        AI_ERROR_FALLBACK
      );
    }
    if (queryError) return queryError.message ?? AI_ERROR_FALLBACK;
    return null;
  }, [
    isEmptySuccess,
    isWorkspaceMissing,
    pollTimedOut,
    reportStatus,
    requestMutation.error,
    queryError,
  ]);

  return {
    reportData,
    requestAnalysis,
    reset,
    isLoading,
    isCheckingSharedReport,
    sharedReportCreatedAt,
    loadingMessage,
    isError,
    errorMessage,
  };
}
