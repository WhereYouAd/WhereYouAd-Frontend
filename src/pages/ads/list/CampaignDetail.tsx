import { useState } from "react";
import { toast } from "sonner";

import type { ICampaignDetail } from "@/types/ads/campaign";

import AdListTable from "@/components/ads/AdListTable";
import CampaignInfoCard from "@/components/ads/CampaignInfoCard";
import PlatformCard from "@/components/ads/PlatformCard";
import Badge from "@/components/common/badge/Badge";
import ControlBox from "@/components/common/controlbox/ControlBox";
import Modal from "@/components/common/modal/Modal";
import ModalContent from "@/components/common/modal/ModalContent";

import { MOCK_CAMPAIGNS } from "./campaign.mock";

import WarningIcon from "@/assets/icon/workspace/message-circle-warning.svg?react";

export default function CampaignDetail() {
  const data = MOCK_CAMPAIGNS[0] as ICampaignDetail;

  // const isPaused = data.status === "PAUSED";
  // const isOngoing = data.status === "ON_GOING";

  const [stopOpen, setStopOpen] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const [resumeOpen, setResumeOpen] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  const onStopConfirm = () => {
    setIsStopping(true);
    try {
      toast.success("해당 캠페인 내 모든 광고 운영이 중단되었습니다.");
      setStopOpen(false);
    } finally {
      setIsStopping(false);
    }
  };

  const onResumeConfirm = () => {
    setIsResuming(true);
    try {
      toast.success("해당 캠페인 운영이 재개되었습니다.");
      setResumeOpen(false);
    } finally {
      setIsResuming(false);
    }
  };

  return (
    <section className="flex flex-col justify-start bg-white rounded-component-lg min-h-[90vh] overflow-x-auto">
      <div className="flex-1 py-15 px-10 md:px-15 lg:px-25">
        <div className="flex flex-col gap-10 w-full">
          {/* header */}
          <header className="flex flex-col gap-5 w-full">
            <div className="flex items-center gap-4 flex-nowrap whitespace-nowrap overflow-hidden w-full">
              <h1 className="font-heading2 text-text-main mr-3">{data.name}</h1>
              <Badge
                variant={data.status === "ON_GOING" ? "running" : "stopped"}
                size="sm"
              >
                {data.status === "ON_GOING"
                  ? "운영 중"
                  : data.status === "PAUSED"
                    ? "중단"
                    : "종료"}
              </Badge>
            </div>
            <div className="border-l-3 border-text-auth-sub pl-4 py-1">
              <p className="text-text-auth-sub font-body1 whitespace-pre-line leading-relaxed">
                {data.description}
              </p>
            </div>
          </header>

          {/* card section */}
          <div className="flex flex-wrap gap-7 w-full">
            <CampaignInfoCard
              budget={data.budget.toLocaleString()}
              date={data.createdAt}
              className="flex-1 min-w-[320px] w-full"
            />
            <PlatformCard
              platforms={["kakao", "google", "naver"]}
              className="flex-1 min-w-[320px] w-full"
            />
          </div>

          <div className="w-full overflow-x-auto">
            {/* ads list */}
            <AdListTable ads={data.ads} />

            {/* campaign controlbox */}
            <div className="mt-10">
              <ControlBox
                title="캠페인 운영 제어"
                description={`전체 플랫폼의 광고 운영을 한번에 제어할 수 있습니다.\n클릭 시 해당 캠페인 내 속한 모든 광고 소재의 운영이 즉시 중단됩니다.`}
                buttonText="중단하기"
                onButtonClick={() => {
                  setStopOpen(true);
                }}
                buttonDisabled={false}
                containerClassName="bg-status-red/7 border-status-red px-6 py-4 min-w-140 shrink-0"
                titleClassName="text-status-red font-heading3"
                descriptionClassName="font-body2 text-text-sub leading-relaxed"
                buttonSize="big"
                buttonClassName="font-body1 bg-status-red"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 해당 캠페인 중단 */}
      <Modal
        isOpen={stopOpen}
        onClose={() => setStopOpen(false)}
        title="캠페인 운영 중단"
      >
        <ModalContent
          icon={<WarningIcon className="text-status-red" />}
          title="캠페인 운영을 중단하시겠습니까?"
          description="해당 캠페인의 모든 광고 노출이 중단됩니다."
          buttonText="중단하기"
          onConfirm={onStopConfirm}
          isLoading={isStopping}
          variant="danger"
        />
      </Modal>

      {/* 해당 캠페인 재개 */}
      <Modal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        title="캠페인 운영 재개"
      >
        <ModalContent
          icon={<WarningIcon className="text-status-blue" />}
          title="캠페인 운영을 재개하시겠습니까?"
          description="해당 캠페인의 모든 광고 노출이 다시 시작됩니다."
          buttonText="시작하기"
          onConfirm={onResumeConfirm}
          isLoading={isResuming}
          variant="primary"
        />
      </Modal>
    </section>
  );
}
