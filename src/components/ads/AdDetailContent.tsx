import { useState } from "react";
import { toast } from "sonner";

import type { IAd } from "@/types/ads/campaign";

import Badge from "../common/badge/Badge";
import ControlBox from "../common/controlbox/ControlBox";
import Modal from "../common/modal/Modal";
import ModalContent from "../common/modal/ModalContent";

import LinkIcon from "@/assets/icon/common/link.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

interface IAdDetailContentProps {
  ad: IAd;
}

export default function AdDetailContent({ ad }: IAdDetailContentProps) {
  // 트래킹 활성화
  const [trackOpen, setTrackOpen] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  // 트래킹 중단
  const [trackStopOpen, setTrackStopOpen] = useState(false);
  const [isTrackStopping, setIsTrackStopping] = useState(false);
  // 광고 중단
  const [stopOpen, setStopOpen] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  // 광고 재개
  const [resumeOpen, setResumeOpen] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  const onTrackConfirm = () => {
    setIsTracking(true);
    try {
      toast.success("트래킹이 활성화되었습니다.");
      setTrackOpen(false);
    } finally {
      setIsTracking(false);
    }
  };

  const onTrackStopConfirm = () => {
    setIsTrackStopping(true);
    try {
      toast.success("트래킹이 중단되었습니다.");
      setTrackStopOpen(false);
    } finally {
      setIsTrackStopping(false);
    }
  };

  const onStopConfirm = () => {
    setIsStopping(true);
    try {
      toast.success("광고 소재 노출이 중단되었습니다.");
      setStopOpen(false);
    } finally {
      setIsStopping(false);
    }
  };

  const onResumeConfirm = () => {
    setIsResuming(true);
    try {
      toast.success("광고 소재 운영이 재개되었습니다.");
      setResumeOpen(false);
    } finally {
      setIsResuming(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("링크가 복사되었습니다.");
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };
  return (
    <div className="px-5 pt-2 pb-6 flex flex-col gap-6 transition-all animate-fade-in overflow-hidden">
      <div className="flex w-full">
        <div className="w-[15%] shrink-0 mr-2" />

        <div className="w-[70%] flex flex-col gap-4 pl-2">
          {/* description */}
          <p className="font-body2 text-text-sub whitespace-pre-line leading-relaxed">
            {ad.description}
          </p>

          {/* tags */}
          <div className="flex flex-wrap gap-2">
            {ad.tags.map((tag, idx) => (
              <Badge
                key={idx}
                variant="running"
                size="sm"
                className="border border-bg-text-sub bg-bg-surface text-text-sub font-normal px-3"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          {/* link */}
          <div className="relative w-full max-w-150 group">
            <div className="flex items-center justify-between w-full h-10 px-4 py-2 bg-white border border-text-placeholder rounded-component-sm group-hover:border-primary-light transition-all">
              <span className="font-body2 text-text-auth-sub truncate pr-10 select-all">
                {ad.link}
              </span>
              <button
                onClick={() => handleCopy(ad.link)}
                className="shrink-0 text-text-placeholder hover:text-primary-main transition-colors p-1"
                title="링크 복사"
              >
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full overflow-x-auto">
        <div className="w-[15%] shrink-0 mr-2" />
        <div className="flex-1 max-w-[85%] flex flex-col gap-6 pl-2 overflow-x-auto overflow-y-hidden">
          <ControlBox
            title="트래킹 활성화 시 실시간 성과 수집이 시작돼요"
            description="광고 클릭/전환 데이터를 실시간으로 수집하여 성과 분석과 보고서에 바로 반영됩니다."
            buttonText="트래킹 활성화"
            onButtonClick={() => {
              setTrackOpen(true);
            }}
            buttonDisabled={false}
            containerClassName="bg-chart-3/7 border-chart-3 px-6 py-4 min-w-[650px] shrink-0"
            titleClassName="text-chart-3 font-heading3"
            descriptionClassName="font-caption text-text-sub"
            buttonSize="big"
            buttonClassName="font-body1"
          />
          <ControlBox
            title={
              ad.runStatus === "stopped"
                ? "광고 소재를 다시 켤 수 있어요"
                : "해당 광고를 중단할 수 있어요"
            }
            description="선택한 광고의 노출과 클릭이 즉시 중단되며, 다른 광고에는 영향을 주지 않습니다."
            buttonText={ad.runStatus === "stopped" ? "재개하기" : "중단하기"}
            onButtonClick={() => {
              ad.runStatus === "stopped"
                ? setResumeOpen(true)
                : setStopOpen(true);
            }}
            buttonDisabled={false}
            containerClassName={`px-6 py-4 min-w-[650px] shrink-0 ${
              ad.runStatus === "stopped"
                ? "bg-status-blue/7 border-status-blue"
                : "bg-status-red/7 border-status-red"
            }`}
            titleClassName={`font-heading3 ${
              ad.runStatus === "stopped"
                ? "text-status-blue"
                : "text-status-red"
            }`}
            descriptionClassName="font-caption text-text-sub"
            buttonSize="big"
            buttonClassName={`font-body1 ${
              ad.runStatus === "stopped" ? "bg-status-blue" : "bg-status-red"
            }`}
          />
        </div>
      </div>

      {/* 트래킹 활성화 */}
      <Modal
        isOpen={trackOpen}
        onClose={() => setTrackOpen(false)}
        title="트래킹 활성화"
      >
        <ModalContent
          icon={<WarnCircleIcon className="text-status-blue" />}
          title="트래킹을 활성화하시겠습니까?"
          description={
            <>
              실시간 광고 성과 데이터를 수집하여
              <br />
              분석 리포트에 즉시 반영합니다.
            </>
          }
          buttonText="시작하기"
          onConfirm={onTrackConfirm}
          isLoading={isTracking}
          variant="primary"
        />
      </Modal>

      {/* 트래킹 중단 */}
      <Modal
        isOpen={trackStopOpen}
        onClose={() => setTrackStopOpen(false)}
        title="트래킹 중단"
      >
        <ModalContent
          icon={<WarnCircleIcon className="text-status-red" />}
          title="트래킹을 중단하시겠습니까?"
          description="데이터 수집이 중단되어 분석 리포트에 공백이 생길 수 있습니다."
          buttonText="중단하기"
          onConfirm={onTrackStopConfirm}
          isLoading={isTrackStopping}
          variant="danger"
        />
      </Modal>

      {/* 광고 소재 중단 */}
      <Modal
        isOpen={stopOpen}
        onClose={() => setStopOpen(false)}
        title="광고 소재 중단"
      >
        <ModalContent
          icon={<WarnCircleIcon className="text-status-red" />}
          title="광고 소재를 중단하시겠습니까?"
          description="해당 광고의 노출이 즉시 중단됩니다."
          buttonText="중단하기"
          onConfirm={onStopConfirm}
          isLoading={isStopping}
          variant="danger"
        />
      </Modal>

      {/* 광고 소재 재개 */}
      <Modal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        title="광고 소재 재개"
      >
        <ModalContent
          icon={<WarnCircleIcon className="text-status-blue" />}
          title="광고 소재의 운영을 재개하시겠습니까?"
          description="중단되었던 광고 소재가 다시 플랫폼에 노출되기 시작합니다."
          buttonText="시작하기"
          onConfirm={onResumeConfirm}
          isLoading={isResuming}
          variant="primary"
        />
      </Modal>
    </div>
  );
}
