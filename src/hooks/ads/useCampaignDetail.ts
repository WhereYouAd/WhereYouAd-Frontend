import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import type { ICampaignDetail } from "@/types/ads/campaign";

import { getCampaignDetail } from "@/api/ads/ads";

export const useCampaignDetail = (orgId: number | null) => {
  const { projectId } = useParams<{ projectId: string }>();

  const [data, setData] = useState<ICampaignDetail | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const fetchDetail = async () => {
    if (!orgId || !projectId) {
      console.log("데이터 부족");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const detailData = await getCampaignDetail(orgId, Number(projectId));
      setData(detailData);
    } catch {
      toast.error("캠페인 상세 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [orgId, projectId]);

  return {
    data,
    isLoading,
    refetch: fetchDetail,
  };
};
