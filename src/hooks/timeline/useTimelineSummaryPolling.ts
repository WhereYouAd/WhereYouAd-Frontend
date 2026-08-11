import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useRequestTimelineSummary } from "./useRequestTimelineSummary";
import { useTimelineDetail } from "./useTimelineDetail";

const SUMMARY_POLL_INTERVAL_MS = 1500;
const SUMMARY_POLL_TIMEOUT_MS = 90000;

export function useTimelineSummaryPolling(selectedBarId: number | null) {
  const [isAwaitingSummary, setIsAwaitingSummary] = useState(false);
  const [summaryPollStartedAt, setSummaryPollStartedAt] = useState<
    number | null
  >(null);

  const { mutate: requestSummary, isPending: isSummaryPending } =
    useRequestTimelineSummary();

  const { data: detail } = useTimelineDetail(selectedBarId, {
    refetchInterval: isAwaitingSummary ? SUMMARY_POLL_INTERVAL_MS : false,
  });

  useEffect(() => {
    setIsAwaitingSummary(false);
    setSummaryPollStartedAt(null);
  }, [selectedBarId]);

  useEffect(() => {
    if (!isAwaitingSummary) return;
    if (!detail?.summary?.trim()) return;
    setIsAwaitingSummary(false);
    setSummaryPollStartedAt(null);
  }, [isAwaitingSummary, detail?.summary]);

  useEffect(() => {
    if (!isAwaitingSummary || summaryPollStartedAt == null) return;
    const timer = window.setTimeout(() => {
      setIsAwaitingSummary(false);
      setSummaryPollStartedAt(null);
      toast.error(
        "더 상세한 요약을 위해 시간이 걸리고 있습니다. 잠시 후 다시 시도해주세요",
      );
    }, SUMMARY_POLL_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [isAwaitingSummary, summaryPollStartedAt]);

  const resetSummaryPolling = () => {
    setIsAwaitingSummary(false);
    setSummaryPollStartedAt(null);
  };

  const handleRequestSummary = () => {
    if (selectedBarId == null) return;
    setIsAwaitingSummary(true);
    setSummaryPollStartedAt(Date.now());
    requestSummary(selectedBarId, {
      onError: () => {
        resetSummaryPolling();
      },
    });
  };

  return {
    isAwaitingSummary,
    isSummaryPending,
    resetSummaryPolling,
    handleRequestSummary,
  };
}
