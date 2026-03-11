import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import CampaignTable from "@/components/ads/CampaignTable";
import ControlBox from "@/components/common/controlbox/ControlBox";
import Modal from "@/components/common/modal/Modal";
import ModalContent from "@/components/common/modal/ModalContent";

import WarningIcon from "@/assets/icon/workspace/message-circle-warning.svg?react";

export default function AdsListPage() {
  const navigate = useNavigate();

  const [stopAllOpen, setStopAllOpen] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const [resumeOpen, setResumeOpen] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  const handleCampaignClick = (id: number) => {
    navigate(`/ads/${id}`);
  };

  const handleCampaignGroupClick = () => {
    navigate("/ads/campaignGroup");
  };

  const onStopAll = () => {
    setIsStopping(true);

    try {
      toast.success("전체 캠페인의 모든 광고 노출이 중단되었습니다.");
      setStopAllOpen(false);
    } finally {
      setIsStopping(false);
    }
  };

  const onResumeAll = () => {
    setIsResuming(true);

    try {
      toast.success("전체 캠페인의 광고 노출이 재개되었습니다.");
      setResumeOpen(false);
    } finally {
      setIsResuming(false);
    }
  };

  return (
    <section className="flex flex-col overflow-hidden bg-white rounded-component-lg min-h-[90vh]">
      <div className="flex-1 overflow-x-auto py-15 px-10 md:px-18 lg:px-25">
        <div className="flex flex-col min-w-180">
          <header className="w-full flex flex-col mb-10">
            <h1 className="font-heading2 text-text-main">광고 운영 관리</h1>
            <p className="font-body2 text-text-placeholder mt-3">
              연결된 캠페인 및 광고 소재의 상세 운영 설정을 확인하고 제어할 수
              있습니다.
            </p>
          </header>
          {/* 테이블 */}
          <div className="w-full flex flex-col mb-10">
            <CampaignTable onRowClick={(id) => handleCampaignClick(id)} />
          </div>
          {/* 하단 배너 */}
          <div className="w-full flex flex-col gap-7">
            <ControlBox
              title="캠페인 통합 운영 제어"
              description={`여러 광고 플랫폼의 캠페인을 하나로 묶어 성과와 운영 상태를 통합 관리합니다.\n광고 플랫폼 로그인 후 캠페인을 불러와 연결합니다.`}
              buttonText="캠페인 통합 연동하기"
              onButtonClick={handleCampaignGroupClick}
              buttonDisabled={false}
              containerClassName="bg-chart-3/7 border-chart-3 px-6 py-4 min-w-[650px] shrink-0"
              titleClassName="text-chart-3 font-heading3"
              descriptionClassName="font-body2 text-text-sub"
              buttonSize="big"
              buttonClassName="font-body1"
            />
            <ControlBox
              title="전체 캠페인을 완전히 중단할 수 있어요"
              description="모든 광고 노출이 즉시 멈추고, 연결된 플랫폼에서도 더 이상 광고가 집행되지 않아요."
              buttonText="중단하기"
              onButtonClick={() => setStopAllOpen(true)}
              buttonDisabled={isStopping}
              containerClassName="bg-status-red/7 border-status-red px-6 py-4 min-w-[650px] shrink-0"
              titleClassName="text-status-red font-heading3"
              descriptionClassName="font-body2 text-text-sub"
              buttonSize="big"
              buttonClassName="font-body1 bg-status-red"
            />
          </div>
        </div>
      </div>

      {/* 전체 캠페인 중단 모달 */}
      <Modal
        isOpen={stopAllOpen}
        onClose={() => setStopAllOpen(false)}
        title="전체 캠페인 중단"
      >
        <ModalContent
          icon={<WarningIcon className="text-status-red" />}
          title="전체 캠페인을 중단하시겠습니까?"
          description="모든 캠페인의 광고 노출이 즉시 중단됩니다."
          buttonText="중단하기"
          onConfirm={onStopAll}
          isLoading={isStopping}
          variant="danger"
        />
      </Modal>

      {/* 전체 캠페인 재개 모달 */}
      <Modal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        title="전체 캠페인 재개"
      >
        <ModalContent
          icon={<WarningIcon className="text-status-blue" />}
          title="전체 캠페인을 재개하시겠습니까?"
          description="모든 캠페인의 광고 노출이 즉시 재개됩니다."
          buttonText="시작하기"
          onConfirm={onResumeAll}
          isLoading={isResuming}
          variant="primary"
        />
      </Modal>

      <div />
    </section>
  );
}
