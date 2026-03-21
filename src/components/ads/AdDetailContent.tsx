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
    successMessage: "트래킹이 활성화되었습니다.",
    errorMessage: "트래킹 활성화에 실패했습니다.",
    onSuccess: refetchAds,
  });

  const stopTrackControl = useControlModal({
    successMessage: "트래킹이 중단되었습니다.",
    errorMessage: "트래킹 중단에 실패했습니다.",
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
            {tags.length > 0 ? (
              tags.map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="running"
                  size="sm"
                  className="border border-bg-text-sub bg-bg-surface text-text-sub font-normal px-3"
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

          {/* link */}
          <div className="relative w-full max-w-150 group">
            <div className="flex items-center justify-between w-full h-10 px-4 py-2 bg-white border border-text-placeholder rounded-component-sm group-hover:border-primary-light transition-all">
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

      <div className="flex w-full">
        <div className="w-[15%] shrink-0 mr-2" />
        <div className="flex-1 min-w-0 flex flex-col gap-6 pl-2">
          <ControlBox
            title={
              isTrackingActive
                ? "트래킹이 활성화되어 데이터 수집 중입니다"
                : "트래킹 활성화 시 실시간 성과 수집이 시작돼요"
            }
            description={
              isTrackingActive
                ? "트래킹을 중단하면 더 이상 광고 성과 리포트가 갱신되지 않습니다."
                : "광고 클릭 데이터를 실시간으로 수집하여 성과 분석에 반영합니다."
            }
            buttonText={isTrackingActive ? "트래킹 중단하기" : "트래킹 활성화"}
            onButtonClick={
              isTrackingActive
                ? stopTrackControl.openModal
                : trackControl.openModal
            }
            buttonDisabled={false}
            containerClassName={`${isTrackingActive ? "bg-status-red/7 border-status-red" : "bg-chart-3/7 border-chart-3"} px-6 py-4 tablet:flex-col tablet:items-start tablet:gap-4`}
            titleClassName={`${isTrackingActive ? "text-status-red" : "text-chart-3"} font-heading3`}
            descriptionClassName="font-caption text-text-sub"
            buttonSize="big"
            buttonClassName={`${
              isTrackingActive ? "bg-status-red" : "bg-chart-3"
            } font-body1 tablet:w-full `}
          />
          <ControlBox
            title={
              ad.status === "PAUSED"
                ? "광고 소재를 다시 켤 수 있어요"
                : "해당 광고를 중단할 수 있어요"
            }
            description="선택한 광고의 노출과 클릭이 즉시 중단되며, 다른 광고에는 영향을 주지 않습니다."
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
            titleClassName={`font-heading3 ${
              ad.status === "PAUSED" ? "text-status-blue" : "text-status-red"
            }`}
            descriptionClassName="font-caption text-text-sub"
            buttonSize="big"
            buttonClassName={`font-body1 tablet:w-full ${
              ad.status === "PAUSED" ? "bg-status-blue" : "bg-status-red"
            }`}
          />
        </div>
      </div>

      {/* 트래킹 활성화 */}
      <Modal
        isOpen={trackControl.isOpen}
        onClose={trackControl.closeModal}
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
          onConfirm={() =>
            trackControl.handleConfirm(async () => {
              if (ad.landingUrl) {
                await createTrackingUrl(Number(orgId), ad.id, ad.landingUrl);
              } else {
                toast.error("landingUrl이 없어 트래킹을 활성화할 수 없습니다.");
              }
            })
          }
          isLoading={trackControl.isLoading}
          variant="primary"
        />
      </Modal>

      {/* 트래킹 중단 */}
      <Modal
        isOpen={stopTrackControl.isOpen}
        onClose={stopTrackControl.closeModal}
        title="트래킹 중단"
      >
        <ModalContent
          icon={<WarnCircleIcon className="text-status-red" />}
          title="트래킹을 중단하시겠습니까?"
          description="데이터 수집이 중단되어 분석 리포트에 공백이 생길 수 있습니다."
          buttonText="중단하기"
          onConfirm={() =>
            stopTrackControl.handleConfirm(async () => {
              /* API 호출 */
            })
          }
          isLoading={stopTrackControl.isLoading}
          variant="danger"
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
