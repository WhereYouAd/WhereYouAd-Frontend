import { useCampaignGroup } from "@/hooks/ads/useCampaignGroup";

import CampaignPlatformDropdown from "@/components/ads/CampaignPlatformDropdown";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import Input from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";
import ModalContent from "@/components/common/modal/ModalContent";
import TextareaField from "@/components/common/textarea/TextareaField";

import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";
import GoogleIcon from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import NaverIcon from "@/assets/logo/social-logo/circle/naver-circle.svg?react";
import KakaoIcon from "@/assets/logo/social-logo/plain/kakao.svg?react";

export default function CampaignGroup() {
  const {
    name,
    setName,
    description,
    setDescription,
    googleSelected,
    setGoogleSelected,
    naverSelected,
    setNaverSelected,
    kakaoSelected,
    setKakaoSelected,
    googleCampaigns,
    naverCampaigns,
    kakaoCampaigns,
    isFormValid,
    isSuccessModalOpen,
    handleCloseSuccessModal,
    isCreating,
    handleComplete,
  } = useCampaignGroup();

  return (
    <section className="flex w-full flex-col gap-8 pb-20">
      {/* 캠페인 기본 정보 */}
      <Card className="flex flex-col gap-8 p-8 tablet:p-10">
        <div className="flex flex-col gap-2">
          <h3 className="font-heading3 text-text-title">캠페인 기본 정보</h3>
          <p className="font-body1 leading-relaxed text-text-muted">
            여러 매체 캠페인을 하나로 묶어 관리합니다.
          </p>
        </div>
        <div className="flex w-full flex-col gap-10">
          {/* 캠페인명 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="campaign-name"
              className="font-body1 text-text-title"
            >
              캠페인명
            </label>
            <Input
              id="campaign-name"
              placeholder="캠페인 이름을 입력하세요."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {/* 캠페인 설명 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="campaign-description"
              className="font-body1 text-text-title"
            >
              캠페인 설명
            </label>
            <TextareaField
              id="campaign-description"
              label=""
              placeholder="캠페인에 대한 설명을 입력하세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minRows={8}
              className="bg-surface-100 ring-1 ring-primary-400/30 hover:ring-primary-400/40 focus:ring-2 focus:ring-primary-400/50"
            />
          </div>
        </div>
      </Card>

      {/* 플랫폼별 캠페인 연결 */}
      <Card className="flex flex-col gap-8 p-8 tablet:p-10">
        <h3 className="font-heading3 text-text-title">플랫폼별 캠페인 연결</h3>
        <div className="flex flex-col gap-10">
          {/* Google */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <GoogleIcon className="w-6 h-6" />
              <span className="font-body1 text-text-title">Google</span>
            </div>
            <CampaignPlatformDropdown
              placeholder="캠페인 선택"
              options={googleCampaigns}
              selected={googleSelected}
              onSelect={setGoogleSelected}
            />
          </div>

          {/* NAVER */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <NaverIcon className="w-6 h-6" />
              <span className="font-body1 text-text-title">NAVER</span>
            </div>
            <CampaignPlatformDropdown
              placeholder="캠페인 선택"
              options={naverCampaigns}
              selected={naverSelected}
              onSelect={setNaverSelected}
            />
          </div>

          {/* Kakao */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <KakaoIcon className="w-6 h-6" />
              <span className="font-body1 text-text-title">Kakao</span>
            </div>
            <CampaignPlatformDropdown
              placeholder="캠페인 선택"
              options={kakaoCampaigns}
              selected={kakaoSelected}
              onSelect={setKakaoSelected}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end mb-5">
        <Button
          size="big"
          className="w-full max-w-40 py-4"
          disabled={!isFormValid || isCreating}
          onClick={handleComplete}
          aria-label="그룹 생성"
        >
          {isCreating ? "그룹 생성 중..." : "그룹 생성"}
        </Button>
      </div>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        size="md"
      >
        <ModalContent
          icon={<WarnCircleIcon className="h-8 w-8 text-info-blue" />}
          title="그룹 생성 완료"
          description="통합 캠페인 그룹이 성공적으로 생성되었습니다."
          buttonText="확인"
          onConfirm={handleCloseSuccessModal}
          variant="primary"
        />
      </Modal>
    </section>
  );
}
