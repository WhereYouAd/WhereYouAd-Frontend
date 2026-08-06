import { useEffect } from "react";
import { toast } from "sonner";

import type { IAd } from "@/types/ads/campaign";

import { useCoreQuery } from "@/hooks/customQuery";

import { getAdList } from "@/api/ads/ads";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useAdList = (orgId: number | null, projectId: number | null) => {
  const isValid =
    orgId != null &&
    projectId != null &&
    Number.isFinite(orgId) &&
    orgId > 0 &&
    Number.isFinite(projectId) &&
    projectId > 0;

  const { data, isLoading, error, isError } = useCoreQuery<IAd[]>(
    QUERY_KEYS.campaign.ads(orgId!, projectId!),
    () => getAdList(orgId!, projectId!),
    { enabled: isValid },
  );

  useEffect(() => {
    if (!isError) return;
    toast.error(error.message ?? "연결된 광고를 불러오지 못했습니다.");
  }, [isError, error]);

  return {
    ads: data ?? [],
    isAdLoading: isLoading,
  };
};
