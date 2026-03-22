import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { IAd } from "@/types/ads/campaign";

import { getAdList } from "@/api/ads/ads";

export const useAdList = (orgId: number | null, projectId: number | null) => {
  const [ads, setAds] = useState<IAd[]>([]);
  const [isAdLoading, setIsAdLoading] = useState(false);

  const fetchAds = async () => {
    if (!orgId || !projectId) return;
    try {
      setIsAdLoading(true);
      const result = await getAdList(orgId, projectId);
      setAds(result);
    } catch {
      toast.error("광고 목록을 불러오지 못했습니다.");
    } finally {
      setIsAdLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [orgId, projectId]);

  return { ads, isAdLoading, refetchAds: fetchAds };
};
