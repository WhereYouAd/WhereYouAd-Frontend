import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { IPlatformCampaign } from "@/types/ads/campaign";

import { getPlatformCampaigns } from "@/api/ads/ads";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export const useCampaignGroup = () => {
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [googleSelected, setGoogleSelected] =
    useState<IPlatformCampaign | null>(null);
  const [naverSelected, setNaverSelected] = useState<IPlatformCampaign | null>(
    null,
  );
  const [kakaoSelected, setKakaoSelected] = useState<IPlatformCampaign | null>(
    null,
  );

  // Google Campaign
  const { data: googleCampaigns = [] } = useQuery<IPlatformCampaign[]>({
    queryKey: ["platformCampaigns", orgId, "GOOGLE"],
    queryFn: () => getPlatformCampaigns(orgId!, "GOOGLE"),
    enabled: !!orgId,
  });

  // Naver Campaing
  const { data: naverCampaigns = [] } = useQuery<IPlatformCampaign[]>({
    queryKey: ["platformCampaigns", orgId, "NAVER"],
    queryFn: () => getPlatformCampaigns(orgId!, "NAVER"),
    enabled: !!orgId,
  });

  // Kakao Campaign
  const { data: kakaoCampaigns = [] } = useQuery<IPlatformCampaign[]>({
    queryKey: ["platformCampaigns", orgId, "KAKAO"],
    queryFn: () => getPlatformCampaigns(orgId!, "KAKAO"),
    enabled: !!orgId,
  });

  return {
    name,
    setName,
    description,
    setDescription,
    googleSelected,
    setGoogleSelected,
    naverSelected,
    setNaverSelected,
    kakaoSelected,
    setKakaoSelected,
    googleCampaigns,
    naverCampaigns,
    kakaoCampaigns,
  };
};
