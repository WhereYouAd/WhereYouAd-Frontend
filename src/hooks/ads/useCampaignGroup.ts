import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { IPlatformCampaign } from "@/types/ads/campaign";

import { useCoreMutation, useCoreQuery } from "@/hooks/customQuery";

import { createCampaignGroup, getPlatformCampaigns } from "@/api/ads/ads";
import { QUERY_KEYS } from "@/lib/queryKeys";
import useWorkspaceStore from "@/store/useWorkspaceStore";

const NONE_OPTION: IPlatformCampaign = {
  adCampaignId: -1,
  name: "연결 안 함",
  description: "",
};

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
  const [metaSelected, setMetaSelected] = useState<IPlatformCampaign | null>(
    null,
  );

  useEffect(() => {
    setName("");
    setDescription("");
    setGoogleSelected(null);
    setNaverSelected(null);
    setMetaSelected(null);
  }, [orgId]);

  const { data: googleData = [], isLoading: isGoogleLoading } = useCoreQuery(
    QUERY_KEYS.campaign.platformList(orgId, "GOOGLE"),
    () => getPlatformCampaigns(orgId!, "GOOGLE"),
    { enabled: !!orgId },
  );

  const { data: naverData = [], isLoading: isNaverLoading } = useCoreQuery(
    QUERY_KEYS.campaign.platformList(orgId, "NAVER"),
    () => getPlatformCampaigns(orgId!, "NAVER"),
    { enabled: !!orgId },
  );

  const { data: metaData = [], isLoading: isMetaLoading } = useCoreQuery(
    QUERY_KEYS.campaign.platformList(orgId, "META"),
    () => getPlatformCampaigns(orgId!, "META"),
    { enabled: !!orgId },
  );

  const isPlatformCampaignsLoading =
    !!orgId && (isGoogleLoading || isNaverLoading || isMetaLoading);

  const googleCampaigns = [NONE_OPTION, ...googleData];
  const naverCampaigns = [NONE_OPTION, ...naverData];
  const metaCampaigns = [NONE_OPTION, ...metaData];

  const isFormValid =
    name.trim() !== "" &&
    [googleSelected, naverSelected, metaSelected].some(
      (sel) => sel !== null && sel.adCampaignId !== -1,
    );

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { mutate: createGroup, isPending: isCreating } = useCoreMutation<
    void,
    void
  >(
    () => {
      const campaignIds: number[] = [
        googleSelected?.adCampaignId,
        naverSelected?.adCampaignId,
        metaSelected?.adCampaignId,
      ].filter(
        (id): id is number => id !== undefined && id !== null && id !== -1,
      );

      return createCampaignGroup(orgId!, {
        name,
        description,
        campaignIds,
      });
    },
    {
      invalidateKeys: [QUERY_KEYS.campaign.list(orgId)],
      userOnSuccess: () => {
        setIsSuccessModalOpen(true);
      },
      userOnError: (error) => {
        toast.error(error.message ?? "그룹 생성에 실패했습니다.");
      },
    },
  );

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
    metaSelected,
    setMetaSelected,
    googleCampaigns,
    naverCampaigns,
    metaCampaigns,
    isPlatformCampaignsLoading,
    isFormValid,
    isCreating,
    handleComplete,
    isSuccessModalOpen,
    handleCloseSuccessModal,
  };
};
