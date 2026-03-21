import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { ICampaign } from "@/types/ads/campaign";

import { useControlModal } from "@/hooks/ads/useControlModal";
import { useCoreQuery } from "@/hooks/customQuery";

import CampaignTable from "@/components/ads/CampaignTable";
import Card from "@/components/common/card/Card";
import ControlBox from "@/components/common/controlbox/ControlBox";
import Modal from "@/components/common/modal/Modal";
import ModalContent from "@/components/common/modal/ModalContent";
import PageHeader from "@/components/common/PageHeader";

import { getCampaignList, updateAllCampaignStatus } from "@/api/ads/ads";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";
import useWorkspaceStore from "@/store/useWorkspaceStore";

export default function AdsListPage() {
  const navigate = useNavigate();
  const orgId = useWorkspaceStore((s) => s.selectedOrgId);

  const { data: campaigns = [], isLoading } = useCoreQuery<ICampaign[]>(
    ["campaigns", orgId],
    () => getCampaignList(orgId!),
    { enabled: !!orgId },
  );

  const stopAll = useControlModal({
    successMessage: "전체 캠페인의 모든 광고 노출이 중단되었습니다.",
    errorMessage: "중단 처리에 실패하였습니다.",
    onSuccess: () => {
      toast.success("전체 캠페인의 모든 광고 노출이 중단되었습니다.");
    },
  });

  const resumeAll = useControlModal({
    successMessage: "전체 캠페인의 광고 노출이 재개되었습니다.",
    errorMessage: "재개 처리에 실패하였습니다.",
    onSuccess: () => {
      toast.success("전체 캠페인의 광고 노출이 재개되었습니다.");
    },
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
      <PageHeader
        title="광고 운영 관리"
        description="연결된 캠페인 및 광고 소재의 상세 운영 설정을 확인하고 제어할 수 있습니다."
      />
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
          containerClassName="bg-chart-3/7 border-chart-3 px-6 py-4"
          titleClassName="text-chart-3 font-heading3"
          descriptionClassName="font-body2 text-text-sub"
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
              containerClassName="bg-status-red/7 border-status-red px-6 py-4"
              titleClassName="text-status-red font-heading3"
              descriptionClassName="font-body2 text-text-sub"
              buttonSize="big"
              buttonClassName="font-body1 bg-status-red"
            />
          ) : (
            <ControlBox
              title="중단된 캠페인을 다시 시작할 수 있어요"
              description="중단되었던 모든 캠페인의 광고 노출이 즉시 재개되며, 다시 활성화됩니다."
              buttonText="시작하기"
              onButtonClick={resumeAll.openModal}
              buttonDisabled={resumeAll.isLoading}
              containerClassName="bg-status-blue/7 border-status-blue px-6 py-4"
              titleClassName="text-status-blue font-heading3"
              descriptionClassName="font-body2 text-text-sub"
              buttonSize="big"
              buttonClassName="font-body1 bg-status-blue"
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
          icon={<WarnCircleIcon className="w-7 h-auto text-status-red" />}
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
          icon={<WarnCircleIcon className="text-status-blue" />}
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
