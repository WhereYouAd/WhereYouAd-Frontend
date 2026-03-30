import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { IPlatformCampaign } from "@/types/ads/campaign";
import type { IApiErrorResponse } from "@/types/common/common";

import { createCampaignGroup, getPlatformCampaigns } from "@/api/ads/ads";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const NONE_OPTION: IPlatformCampaign = {
  adCampaignId: -1,
  name: "선택 안 함",
  description: "",
};

export const useCampaignGroup = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const { data: googleData = [] } = useQuery<IPlatformCampaign[]>({
    queryKey: ["platformCampaigns", orgId, "GOOGLE"],
    queryFn: () => getPlatformCampaigns(orgId!, "GOOGLE"),
    enabled: !!orgId,
  });

  const { data: naverData = [] } = useQuery<IPlatformCampaign[]>({
    queryKey: ["platformCampaigns", orgId, "NAVER"],
    queryFn: () => getPlatformCampaigns(orgId!, "NAVER"),
    enabled: !!orgId,
  });

  const { data: kakaoData = [] } = useQuery<IPlatformCampaign[]>({
    queryKey: ["platformCampaigns", orgId, "KAKAO"],
    queryFn: () => getPlatformCampaigns(orgId!, "KAKAO"),
    enabled: !!orgId,
  });

  // '선택 안 함'이 포함된 리스트 생성
  const googleCampaigns = [NONE_OPTION, ...googleData];
  const naverCampaigns = [NONE_OPTION, ...naverData];
  const kakaoCampaigns = [NONE_OPTION, ...kakaoData];

  // 유효성 검사 (실제 캠페인이 하나라도 선택되었는지 확인)
  const isFormValid =
    name.trim() !== "" &&
    [googleSelected, naverSelected, kakaoSelected].some(
      (sel) => sel !== null && sel.adCampaignId !== -1,
    );

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { mutate: createGroup, isPending: isCreating } = useMutation({
    mutationFn: () => {
      const campaignIds: number[] = [
        googleSelected?.adCampaignId,
        naverSelected?.adCampaignId,
        kakaoSelected?.adCampaignId,
      ].filter(
        (id): id is number => id !== undefined && id !== null && id !== -1,
      );

      return createCampaignGroup(orgId!, {
        name,
        description,
        campaignIds,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns", orgId] });
      setIsSuccessModalOpen(true);
    },
    onError: (error) => {
      toast.error(
        (error as unknown as IApiErrorResponse).message ??
          "캠페인 그룹 생성에 실패했습니다.",
      );
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
