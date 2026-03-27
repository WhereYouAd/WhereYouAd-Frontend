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
    <section className="flex flex-col justify-start bg-white rounded-component-lg min-h-[90vh] overflow-x-auto">
      <div className="flex-1 py-10 px-20 tablet:px-10">
        <div className="flex flex-col gap-10 w-full">
          {/* header */}
          <header className="flex flex-col gap-5 w-full">
            <button
              onClick={() => navigate("/ads")}
              className="flex items-center gap-2 text-text-sub font-body2 hover:text-text-main transition-colors w-fit mb-3"
            >
              <LeftChevronIcon className="w-4 h-4" />
              광고 운영 관리
            </button>

            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between w-full tablet:flex-col tablet:items-start tablet:gap-2">
                <div className="flex items-center gap-5">
                  <h1 className="font-heading2 text-text-main">{data.name}</h1>
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
                <span className="text-text-placeholder font-body2">
                  {data.createdAt.replaceAll("-", ".")} 등록
                </span>
              </div>

              <div className="flex items-center gap-4 text-text-sub font-body2">
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
                  <p className="text-text-sub font-body2 whitespace-pre-line leading-relaxed">
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
                  containerClassName="bg-status-red/7 border-status-red px-6 py-4"
                  titleClassName="text-status-red font-heading3"
                  descriptionClassName="font-body2 text-text-sub leading-relaxed"
                  buttonSize="big"
                  buttonClassName="font-body1 bg-status-red"
                />
              ) : data.status === "PAUSED" ? (
                <ControlBox
                  title="캠페인 운영 제어"
                  description={`중단된 캠페인을 다시 활성화하여 광고 노출을 시작합니다.`}
                  buttonText="시작하기"
                  onButtonClick={resumeControl.openModal}
                  buttonDisabled={resumeControl.isLoading}
                  containerClassName="bg-status-blue/7 border-status-blue px-6 py-4"
                  titleClassName="text-status-blue font-heading3"
                  descriptionClassName="font-body2 text-text-sub leading-relaxed"
                  buttonSize="big"
                  buttonClassName="font-body1 bg-status-blue"
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
          icon={<WarnCircleIcon className="text-status-red" />}
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
          icon={<WarnCircleIcon className="text-status-blue" />}
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
