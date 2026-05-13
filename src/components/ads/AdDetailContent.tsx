import { useParams } from "react-router-dom";
import { toast } from "sonner";

import type { IAd } from "@/types/ads/campaign";

import { useControlModal } from "@/hooks/ads/useControlModal";

import Badge from "../common/badge/Badge";
import Button from "../common/button/Button";
import Modal from "../common/modal/Modal";
import ModalContent from "../common/modal/ModalContent";

import { createTrackingUrl } from "@/api/ads/ads";
import LinkIcon from "@/assets/icon/common/link.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

export default function AdDetailContent({
  ad,
  refetchAds,
}: {
  ad: IAd;
  refetchAds: () => void;
}) {
  const { orgId } = useParams<{
    orgId: string;
    projectId: string;
  }>();

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
    <div className="animate-fade-in">
      <div className="border-t border-surface-400/60">
        <div className="flex flex-col gap-4 px-4 pb-2 pt-4 tablet:px-5">
          <section className="rounded-lg border border-surface-400/40 bg-surface-100 px-4 py-3">
            <h3 className="mb-2 font-caption text-text-placeholder">
              광고 소재
            </h3>
            <p className="font-body2 leading-relaxed whitespace-pre-line text-text-body">
              {ad.description}
            </p>
          </section>

          <section className="rounded-lg border border-surface-400/40 bg-surface-100 px-4 py-3">
            <h3 className="mb-2 font-caption text-text-placeholder">타겟</h3>
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="infoBlue"
                    className="border border-surface-400 bg-surface-100 px-3 text-text-muted"
                  >
                    #{tag}
                  </Badge>
                ))
              ) : (
                <span className="font-caption text-text-placeholder">
                  설정된 타겟 정보가 없습니다.
                </span>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-surface-400/40 bg-surface-100 px-4 py-3">
            <h3 className="mb-2 font-caption text-text-placeholder">
              랜딩 URL
            </h3>
            <div className="relative w-full max-w-160">
              <div className="flex h-9 w-full items-center justify-between rounded-lg border border-surface-400 bg-surface-100 px-4 py-2 transition-colors hover:border-primary-200">
                <span className="truncate pr-10 font-body2 text-text-auth-sub select-all">
                  {ad.landingUrl}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    ad.landingUrl && handleCopy(ad.landingUrl);
                  }}
                  className="shrink-0 p-1 text-text-placeholder transition-colors hover:text-primary-500"
                  title="링크 복사"
                >
                  <LinkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="mx-4 mb-4 mt-1 overflow-hidden rounded-lg border border-surface-400/40 bg-surface-100 tablet:mx-5">
          <div className="flex flex-wrap items-start justify-between gap-3 gap-y-3 px-4 py-4">
            <div className="min-w-0 flex-1">
              <p className="font-caption text-text-placeholder">트래킹</p>
              <p className="mt-1 font-body1 text-text-title">
                {isTrackingActive
                  ? "트래킹 링크가 발급되었습니다"
                  : "트래킹 링크를 발급받아 성과를 수집해보세요"}
              </p>
              <p className="mt-1 font-caption text-text-muted">
                {isTrackingActive
                  ? "발급된 트래킹 링크를 해당 광고 플랫폼에 등록해 주세요."
                  : "링크를 광고 플랫폼에 등록하면 클릭 성과가 리포트에 반영됩니다."}
              </p>
              <p className="mt-2 font-caption text-text-placeholder">
                중단·재개는 목록 상단의 버튼에서 선택 후 진행할 수 있어요.
              </p>
            </div>
            <Button
              type="button"
              size="small"
              variant={isTrackingActive ? "outline" : "gradient"}
              className={
                isTrackingActive
                  ? "shrink-0 border-info-blue text-info-blue hover:bg-info-blue/5 tablet:w-full tablet:justify-center"
                  : "shrink-0 tablet:w-full tablet:justify-center"
              }
              onClick={
                isTrackingActive
                  ? () => handleCopy(ad.trackingUrl!)
                  : trackControl.openModal
              }
            >
              {isTrackingActive ? "링크 복사하기" : "링크 발급하기"}
            </Button>
          </div>
        </div>
      </div>

      {/* 트래킹 링크 발급 */}
      <Modal
        isOpen={trackControl.isOpen}
        onClose={trackControl.closeModal}
        title="트래킹 링크 발급"
      >
        <ModalContent
          icon={<WarnCircleIcon className="text-info-blue" />}
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
    </div>
  );
}
