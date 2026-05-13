import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useControlModal } from "@/hooks/ads/useControlModal";
import { useOverviewCampaignList } from "@/hooks/dashboard/useOverviewCampaignList";

import CampaignTable from "@/components/ads/CampaignTable";
import Card from "@/components/common/card/Card";
import ControlBox from "@/components/common/controlbox/ControlBox";
import Modal from "@/components/common/modal/Modal";
import ModalContent from "@/components/common/modal/ModalContent";

import { updateAllCampaignStatus } from "@/api/ads/ads";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function AdsListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  const { data: campaigns = [], isLoading } = useOverviewCampaignList();

  const invalidateCampaigns = () => {
    queryClient.invalidateQueries({ queryKey: ["campaigns", orgId] });
  };

  const stopAll = useControlModal({
    successMessage: "전체 캠페인의 모든 광고 노출이 중단되었습니다.",
    errorMessage: "중단 처리에 실패하였습니다.",
    onSuccess: invalidateCampaigns,
  });

  const resumeAll = useControlModal({
    successMessage: "전체 캠페인의 광고 노출이 재개되었습니다.",
    errorMessage: "재개 처리에 실패하였습니다.",
    onSuccess: invalidateCampaigns,
  });

  const handleCampaignClick = (id: number) => {
    navigate(`/ads/${orgId}/${id}`);
  };

  const handleCampaignGroupClick = () => {
    navigate("/ads/campaignGroup");
  };

  const hasCampaigns = campaigns.length > 0;
  const hasActiveCampaign = campaigns.some((c) => c.status === "ON_GOING");

  if (isLoading) {
    return (
      <div className="flex h-[90vh] items-center justify-center">
        <p className="font-body1 text-text-placeholder">
          데이터를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col gap-8">
      {/* 테이블 */}
      <Card>
        <CampaignTable
          campaigns={campaigns}
          onRowClick={(id) => handleCampaignClick(id)}
        />
      </Card>
      {/* 하단 배너 */}
      <div className="flex flex-col gap-7">
        <ControlBox
          title="캠페인 통합 운영 제어"
          description={`여러 광고 플랫폼의 캠페인을 하나로 묶어 성과와 운영 상태를 통합 관리합니다.\n광고 플랫폼 로그인 후 캠페인을 불러와 연결합니다.`}
          buttonText="캠페인 통합 연동하기"
          onButtonClick={handleCampaignGroupClick}
          buttonDisabled={false}
          containerClassName="border-primary-300 bg-primary-100/50 px-6 py-4"
          titleClassName="font-heading3 text-primary-500"
          descriptionClassName="font-body2 text-text-muted"
          buttonSize="big"
          buttonClassName="font-body1"
        />
        {hasCampaigns &&
          (hasActiveCampaign ? (
            <ControlBox
              title="전체 캠페인을 완전히 중단할 수 있어요"
              description="모든 광고 노출이 즉시 멈추고, 연결된 플랫폼에서도 더 이상 광고가 집행되지 않아요."
              buttonText="중단하기"
              onButtonClick={stopAll.openModal}
              buttonDisabled={stopAll.isLoading}
              containerClassName="border-info-red bg-info-red/10 px-6 py-4"
              titleClassName="font-heading3 text-info-red"
              descriptionClassName="font-body2 text-text-muted"
              buttonSize="big"
              buttonClassName="font-body1 bg-info-red text-white hover:opacity-90"
            />
          ) : (
            <ControlBox
              title="중단된 캠페인을 다시 시작할 수 있어요"
              description="중단되었던 모든 캠페인의 광고 노출이 즉시 재개되며, 다시 활성화됩니다."
              buttonText="시작하기"
              onButtonClick={resumeAll.openModal}
              buttonDisabled={resumeAll.isLoading}
              containerClassName="border-info-blue bg-info-blue/10 px-6 py-4"
              titleClassName="font-heading3 text-info-blue"
              descriptionClassName="font-body2 text-text-muted"
              buttonSize="big"
              buttonClassName="font-body1 bg-info-blue text-white hover:opacity-90"
            />
          ))}
      </div>

      {/* 전체 캠페인 중단 모달 */}
      <Modal
        isOpen={stopAll.isOpen}
        onClose={stopAll.closeModal}
        title="전체 캠페인 중단"
      >
        <ModalContent
          icon={<WarnCircleIcon className="h-auto w-7 text-info-red" />}
          title="전체 캠페인을 중단하시겠습니까?"
          description="모든 캠페인의 광고 노출이 즉시 중단됩니다."
          buttonText="중단하기"
          onConfirm={() =>
            stopAll.handleConfirm(() =>
              updateAllCampaignStatus(orgId!, "PAUSED"),
            )
          }
          isLoading={stopAll.isLoading}
          variant="danger"
        />
      </Modal>

      {/* 전체 캠페인 재개 모달 */}
      <Modal
        isOpen={resumeAll.isOpen}
        onClose={resumeAll.closeModal}
        title="전체 캠페인 재개"
      >
        <ModalContent
          icon={<WarnCircleIcon className="text-info-blue" />}
          title="전체 캠페인을 재개하시겠습니까?"
          description="모든 캠페인의 광고 노출이 즉시 재개됩니다."
          buttonText="시작하기"
          onConfirm={() =>
            resumeAll.handleConfirm(() =>
              updateAllCampaignStatus(orgId!, "ON_GOING"),
            )
          }
          isLoading={resumeAll.isLoading}
          variant="primary"
        />
      </Modal>
    </section>
  );
}
