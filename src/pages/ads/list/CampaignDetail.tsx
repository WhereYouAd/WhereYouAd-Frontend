import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { TPlatform } from "@/types/ads/campaign";

import { useAdList } from "@/hooks/ads/useAdList";
import { useCampaignDetail } from "@/hooks/ads/useCampaignDetail";
import { useControlModal } from "@/hooks/ads/useControlModal";

import AdListTable from "@/components/ads/AdListTable";
import Badge from "@/components/common/badge/Badge";
import ControlBox from "@/components/common/controlbox/ControlBox";
import Modal from "@/components/common/modal/Modal";
import ModalContent from "@/components/common/modal/ModalContent";

import { updateCampaignStatus } from "@/api/ads/ads";
import LeftChevronIcon from "@/assets/icon/chevron/chervon-left.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";
import GoogleLogo from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import KakaoLogo from "@/assets/logo/social-logo/circle/kakao-circle.svg?react";
import NaverLogo from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

const LogoMap: Record<TPlatform, React.ReactNode> = {
  kakao: <KakaoLogo className="w-6 h-6" />,
  google: <GoogleLogo className="w-6 h-6" />,
  naver: <NaverLogo className="w-6 h-6" />,
};

export default function CampaignDetail() {
  const { orgId, projectId } = useParams<{
    orgId: string;
    projectId: string;
  }>();
  const { data, isLoading, refetch } = useCampaignDetail();

  const { ads, isAdLoading, refetchAds } = useAdList(
    orgId ? Number(orgId) : null,
    projectId ? Number(projectId) : null,
  );

  const navigate = useNavigate();

  const stopControl = useControlModal({
    successMessage: "해당 캠페인의 모든 광고 운영이 중단되었습니다.",
    errorMessage: "중단 처리에 실패하였습니다.",
    onSuccess: () => {
      refetch();
      refetchAds();
    },
  });

  const resumeControl = useControlModal({
    successMessage: "해당 캠페인의 광고 운영이 재개되었습니다.",
    errorMessage: "재개 처리에 실패하였습니다.",
    onSuccess: () => {
      refetch();
      refetchAds();
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[90vh] items-center justify-center">
        <p className="font-body1 text-text-placeholder">
          데이터를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-center text-text-placeholder">
        정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <section className="flex min-h-[90vh] flex-col justify-start overflow-x-auto rounded-3xl bg-surface-100">
      <div className="flex-1 py-10 px-20 tablet:px-10">
        <div className="flex flex-col gap-10 w-full">
          {/* header */}
          <header className="flex flex-col gap-5 w-full">
            <button
              onClick={() => navigate("/ads")}
              className="mb-3 flex w-fit items-center gap-2 font-body2 text-text-muted transition-colors hover:text-text-title"
            >
              <LeftChevronIcon className="w-4 h-4" />
              광고 운영 관리
            </button>

            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between w-full tablet:flex-col tablet:items-start tablet:gap-2">
                <div className="flex items-center gap-5">
                  <h1 className="font-heading2 text-text-title">{data.name}</h1>
                  <Badge
                    variant={
                      data.status === "ON_GOING" ? "infoBlue" : "surface"
                    }
                  >
                    {data.status === "ON_GOING"
                      ? "운영 중"
                      : data.status === "PAUSED"
                        ? "중단"
                        : "종료"}
                  </Badge>
                </div>
                <span className="text-text-placeholder font-body2">
                  {data.createdAt.replaceAll("-", ".")} 등록
                </span>
              </div>

              <div className="flex items-center gap-4 font-body2 text-text-muted">
                <span>예산 {data.budget.toLocaleString()}원</span>
                <span className="text-text-placeholder">·</span>
                <div className="flex items-center gap-1">
                  {data.providers.map((provider) => {
                    const platform = provider.toLowerCase() as TPlatform;
                    return (
                      <div
                        key={provider}
                        title={provider}
                        className="flex items-center justify-center w-6 h-6 rounded-full overflow-hidden shadow-sm"
                      >
                        {LogoMap[platform] || null}
                      </div>
                    );
                  })}
                </div>
              </div>

              {data.description && (
                <div className="flex flex-col gap-1">
                  <p className="font-body2 leading-relaxed whitespace-pre-line text-text-muted">
                    {data.description}
                  </p>
                </div>
              )}
            </div>
          </header>

          <div className="w-full">
            {/* ads list */}
            {isAdLoading ? (
              <div className="py-20 text-center font-body2 text-text-placeholder">
                광고 목록을 불러오는 중입니다...
              </div>
            ) : (
              <AdListTable ads={ads || []} refetchAds={refetchAds} />
            )}

            {/* campaign controlbox */}
            <div className="mt-10">
              {data.status === "ON_GOING" ? (
                <ControlBox
                  title="캠페인 운영 중단"
                  description={`클릭 시 해당 캠페인 내 속한 모든 광고 소재의 운영이 즉시 중단됩니다.`}
                  buttonText="중단하기"
                  onButtonClick={stopControl.openModal}
                  buttonDisabled={stopControl.isLoading}
                  containerClassName="border-info-red bg-info-red/10 px-6 py-4"
                  titleClassName="font-heading3 text-info-red"
                  descriptionClassName="font-body2 leading-relaxed text-text-muted"
                  buttonSize="big"
                  buttonClassName="font-body1 bg-info-red text-surface-100 hover:opacity-90"
                />
              ) : data.status === "PAUSED" ? (
                <ControlBox
                  title="캠페인 운영 제어"
                  description={`중단된 캠페인을 다시 활성화하여 광고 노출을 시작합니다.`}
                  buttonText="시작하기"
                  onButtonClick={resumeControl.openModal}
                  buttonDisabled={resumeControl.isLoading}
                  containerClassName="border-info-blue bg-info-blue/10 px-6 py-4"
                  titleClassName="font-heading3 text-info-blue"
                  descriptionClassName="font-body2 leading-relaxed text-text-muted"
                  buttonSize="big"
                  buttonClassName="font-body1 bg-info-blue text-surface-100 hover:opacity-90"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* 해당 캠페인 중단 */}
      <Modal
        isOpen={stopControl.isOpen}
        onClose={stopControl.closeModal}
        title="캠페인 운영 중단"
      >
        <ModalContent
          icon={<WarnCircleIcon className="text-info-red" />}
          title="캠페인 운영을 중단하시겠습니까?"
          description="해당 캠페인의 모든 광고 노출이 중단됩니다."
          buttonText="중단하기"
          onConfirm={() =>
            stopControl.handleConfirm(() =>
              updateCampaignStatus(Number(orgId), Number(projectId), "PAUSED"),
            )
          }
          isLoading={stopControl.isLoading}
          variant="danger"
        />
      </Modal>

      {/* 해당 캠페인 재개 */}
      <Modal
        isOpen={resumeControl.isOpen}
        onClose={resumeControl.closeModal}
        title="캠페인 운영 재개"
      >
        <ModalContent
          icon={<WarnCircleIcon className="text-info-blue" />}
          title="캠페인 운영을 재개하시겠습니까?"
          description="해당 캠페인의 모든 광고 노출이 다시 시작됩니다."
          buttonText="시작하기"
          onConfirm={() =>
            resumeControl.handleConfirm(() =>
              updateCampaignStatus(
                Number(orgId),
                Number(projectId),
                "ON_GOING",
              ),
            )
          }
          isLoading={resumeControl.isLoading}
          variant="primary"
        />
      </Modal>
    </section>
  );
}
