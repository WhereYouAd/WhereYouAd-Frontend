import { useParams } from "react-router-dom";
import { toast } from "sonner";

import type { IAd } from "@/types/ads/campaign";

import { useControlModal } from "@/hooks/ads/useControlModal";

import Badge from "../common/badge/Badge";
import ControlBox from "../common/controlbox/ControlBox";
import Modal from "../common/modal/Modal";
import ModalContent from "../common/modal/ModalContent";

import { createTrackingUrl, updateAdStatus } from "@/api/ads/ads";
import LinkIcon from "@/assets/icon/common/link.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

export default function AdDetailContent({
  ad,
  refetchAds,
}: {
  ad: IAd;
  refetchAds: () => void;
}) {
  const { orgId, projectId } = useParams<{
    orgId: string;
    projectId: string;
  }>();

  const stopControl = useControlModal({
    successMessage: "광고 소재 노출이 중단되었습니다.",
    errorMessage: "중단 처리에 실패했습니다.",
    onSuccess: refetchAds,
  });

  const resumeControl = useControlModal({
    successMessage: "광고 소재 운영이 재개되었습니다.",
    errorMessage: "재개 처리에 실패했습니다.",
    onSuccess: refetchAds,
  });

  const trackControl = useControlModal({
    successMessage: "트래킹 링크가 발급되었습니다.",
    errorMessage: "트래킹 링크 발급에 실패했습니다.",
    onSuccess: refetchAds,
  });

  const isTrackingActive = !!ad.trackingUrl && ad.trackingUrl.length > 0;

  //targetInfo 변환
  const targetTags = () => {
    try {
      if (!ad.targetInfo) return [];
      const parsed = JSON.parse(ad.targetInfo);
      return Object.values(parsed) as string[];
    } catch {
      return ad.targetInfo ? [ad.targetInfo] : [];
    }
  };

  const tags = targetTags();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("링크가 복사되었습니다.");
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  return (
    <div className="pt-5 pb-5 flex flex-col gap-7 bg-bg-surface/30 transition-all animate-fade-in overflow-hidden border-t border-bg-disabled">
      <div className="flex flex-col w-full px-8 gap-6 tablet:flex-col tablet:gap-8">
        {/* description */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <span className="text-text-placeholder font-caption">광고 소재</span>
          <p className="font-body2 text-text-sub whitespace-pre-line leading-relaxed">
            {ad.description}
          </p>
        </div>

        {/* tags */}
        <div className="w-[30%] flex flex-col gap-2 shrink-0 tablet:w-full">
          <span className="text-text-placeholder font-caption">타겟</span>
          <div className="flex flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="running"
                  size="sm"
                  className="border border-bg-disabled bg-white text-text-sub px-3"
                >
                  #{tag}
                </Badge>
              ))
            ) : (
              <span className="text-caption text-text-placeholder">
                설정된 타겟 정보가 없습니다.
              </span>
            )}
          </div>
        </div>

        {/* link */}
        <div className="flex flex-col gap-2">
          <span className="text-text-placeholder font-caption">랜딩 URL</span>
          <div className="relative w-full max-w-160">
            <div className="flex items-center justify-between w-full h-9 px-4 py-2 bg-white border border-bg-disabled rounded-component-sm group-hover:border-primary-light transition-all">
              <span className="font-body2 text-text-auth-sub truncate pr-10 select-all">
                {ad.landingUrl}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  ad.landingUrl && handleCopy(ad.landingUrl);
                }}
                className="shrink-0 text-text-placeholder hover:text-primary-main transition-colors p-1"
                title="링크 복사"
              >
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full px-8">
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <ControlBox
            title={
              isTrackingActive
                ? "트래킹 링크가 발급되었습니다"
                : "트래킹 링크를 발급받아 성과를 수집해보세요"
            }
            description={
              isTrackingActive
                ? "발급된 트래킹 링크를 해당 광고 플랫폼에 등록해 주세요."
                : "링크를 광고 플랫폼에 등록하면 클릭 성과가 리포트에 반영됩니다."
            }
            buttonText={isTrackingActive ? "링크 복사하기" : "링크 발급하기"}
            onButtonClick={
              isTrackingActive
                ? () => handleCopy(ad.trackingUrl!)
                : trackControl.openModal
            }
            buttonDisabled={false}
            containerClassName="bg-status-blue/7 border-status-blue px-6 py-4"
            titleClassName="text-status-blue font-heading4 -mb-1"
            descriptionClassName="font-caption text-text-sub"
            buttonSize="small"
            buttonClassName="bg-status-blue font-body2 tablet:w-full"
          />

          <ControlBox
            title={
              ad.status === "PAUSED"
                ? "광고 소재를 다시 켤 수 있어요"
                : "해당 광고를 중단할 수 있어요"
            }
            description={
              ad.status === "PAUSED"
                ? "중단되었던 광고 소재가 다시 플랫폼에 노출되며 광고 운영이 재개됩니다."
                : "선택한 광고의 노출과 클릭이 즉시 중단되며, 다른 광고에는 영향을 주지 않습니다."
            }
            buttonText={ad.status === "PAUSED" ? "재개하기" : "중단하기"}
            onButtonClick={
              ad.status === "PAUSED"
                ? resumeControl.openModal
                : stopControl.openModal
            }
            buttonDisabled={false}
            containerClassName={`px-6 py-4 tablet:flex-col tablet:items-start tablet:gap-4 ${
              ad.status === "PAUSED"
                ? "bg-status-blue/7 border-status-blue"
                : "bg-status-red/7 border-status-red"
            }`}
            titleClassName={`font-heading4 -mb-1 ${
              ad.status === "PAUSED" ? "text-status-blue" : "text-status-red"
            }`}
            descriptionClassName="font-caption text-text-sub"
            buttonSize="small"
            buttonClassName={`font-body2 tablet:w-full ${
              ad.status === "PAUSED" ? "bg-status-blue" : "bg-status-red"
            }`}
          />
        </div>
      </div>

      {/* 트래킹 링크 발급 */}
      <Modal
        isOpen={trackControl.isOpen}
        onClose={trackControl.closeModal}
        title="트래킹 링크 발급"
      >
        <ModalContent
          icon={<WarnCircleIcon className="text-status-blue" />}
          title="트래킹 링크를 발급하시겠습니까?"
          description={
            <>
              발급된 링크를 복사하여 광고 플랫폼에 등록하면
              <br />
              트래킹을 활성화할 수 있습니다.
            </>
          }
          buttonText="발급하기"
          onConfirm={() =>
            trackControl.handleConfirm(async () => {
              if (!ad.landingUrl) {
                toast.error(
                  "광고에 등록된 랜딩 URL이 없어 발급이 불가능합니다.",
                );
                throw new Error("랜딩 URL이 없습니다.");
              }
              await createTrackingUrl(Number(orgId), ad.id, ad.landingUrl);
            })
          }
          isLoading={trackControl.isLoading}
          variant="primary"
        />
      </Modal>

      {/* 광고 소재 중단 */}
      <Modal
        isOpen={stopControl.isOpen}
        onClose={stopControl.closeModal}
        title="광고 소재 중단"
      >
        <ModalContent
          icon={<WarnCircleIcon className="text-status-red" />}
          title="광고 소재를 중단하시겠습니까?"
          description="해당 광고의 노출이 즉시 중단됩니다."
          buttonText="중단하기"
          onConfirm={() =>
            stopControl.handleConfirm(() =>
              updateAdStatus(Number(orgId), Number(projectId), ad.id, "PAUSED"),
            )
          }
          isLoading={stopControl.isLoading}
          variant="danger"
        />
      </Modal>

      {/* 광고 소재 재개 */}
      <Modal
        isOpen={resumeControl.isOpen}
        onClose={resumeControl.closeModal}
        title="광고 소재 재개"
      >
        <ModalContent
          icon={<WarnCircleIcon className="text-status-blue" />}
          title="광고 운영을 재개하시겠습니까?"
          description="중단되었던 광고 소재가 다시 플랫폼에 노출되기 시작합니다."
          buttonText="시작하기"
          onConfirm={() =>
            resumeControl.handleConfirm(() =>
              updateAdStatus(
                Number(orgId),
                Number(projectId),
                ad.id,
                "ON_GOING",
              ),
            )
          }
          isLoading={resumeControl.isLoading}
          variant="primary"
        />
      </Modal>
    </div>
  );
}
