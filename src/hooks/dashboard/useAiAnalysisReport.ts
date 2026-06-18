import { useCallback, useEffect, useMemo, useState } from "react";
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
  requestAiAnalysis,
} from "@/api/dashboard/aiAnalysis";
import { queryClient } from "@/lib/queryClient";
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

function aiReportQueryKey(provider: TAiAnalysisProvider, accessToken: string) {
  return QUERY_KEYS.ai.report(provider, accessToken);
}

/** AI 요약: POST 요청 → accessToken → GET 폴링 → reportData */
export function useAiAnalysisReport(provider: TAiAnalysisProvider = "ALL") {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [pollStartedAt, setPollStartedAt] = useState<number | null>(null);
  const [workspaceErrorShown, setWorkspaceErrorShown] = useState(false);

  /** 재요청 전 상태 초기화 */
  const reset = useCallback(() => {
    setAccessToken(null);
    setPollStartedAt(null);
    setWorkspaceErrorShown(false);
  }, []);

  useEffect(() => {
    reset();
  }, [provider, reset]);

  useEffect(() => {
    const token = accessToken;
    if (!token) return;

    return () => {
      void queryClient.removeQueries({
        queryKey: aiReportQueryKey(provider, token),
      });
    };
  }, [accessToken, provider]);

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
          queryKey: aiReportQueryKey(provider, token),
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
    aiReportQueryKey(provider, accessToken ?? ""),
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
      requestMutation.mutate(params ?? {});
    },
    [orgId, reset, requestMutation],
  );

  const isSubmitting = requestMutation.isPending;
  const isPolling =
    !!accessToken && reportStatus === "PENDING" && !pollTimedOut;

  const isLoading = isSubmitting || isPolling;

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
    if (isSubmitting) return "분석을 요청하고 있어요…";
    if (isPolling)
      return "AI가 광고 성과를 분석 중이에요. 보통 10~30초 걸려요.";
    return null;
  }, [isSubmitting, isPolling]);

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
    loadingMessage,
    isError,
    errorMessage,
  };
}
