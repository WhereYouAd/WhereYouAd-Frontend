import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import type { IPlatformCampaign } from "@/types/ads/campaign";

import { createCampaignGroup, getPlatformCampaigns } from "@/api/ads/ads";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export const useCampaignGroup = () => {
  const navigate = useNavigate();
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

  // 유효성 검사 (캠페인명, 최소 하나의 플랫폼 캠페인)
  const isFormValid =
    name.trim() !== "" &&
    (googleSelected !== null ||
      naverSelected !== null ||
      kakaoSelected !== null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { mutate: createGroup, isPending: isCreating } = useMutation({
    mutationFn: () => {
      const campaignIds: number[] = [
        googleSelected?.adCampaignId,
        naverSelected?.adCampaignId,
        kakaoSelected?.adCampaignId,
      ].filter((id): id is number => !!id);

      return createCampaignGroup(orgId!, {
        name,
        description,
        campaignIds,
      });
    },
    onSuccess: () => {
      setIsSuccessModalOpen(true);
    },
    onError: () => {
      alert("캠페인 그룹 생성에 실패했습니다.");
    },
  });
  const handleComplete = () => {
    if (!isFormValid) return;
    createGroup();
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate("/ads");
  };

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
    isFormValid,
    isCreating,
    handleComplete,
    isSuccessModalOpen,
    handleCloseSuccessModal,
  };
};
