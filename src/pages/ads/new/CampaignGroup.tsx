import type { IPlatformCampaign } from "@/types/ads/campaign";

import { useCampaignGroup } from "@/hooks/ads/useCampaignGroup";

import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import Input from "@/components/common/input/Input";
import Modal from "@/components/common/modal/Modal";
import ModalContent from "@/components/common/modal/ModalContent";
import DropdownSelect from "@/components/common/select/DropdownSelect";
import TextareaField from "@/components/common/textarea/TextareaField";

import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";
import GoogleIcon from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import KakaoIcon from "@/assets/logo/social-logo/circle/kakao-circle.svg?react";
import NaverIcon from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

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
    <section className="flex min-h-screen w-full flex-col items-center bg-surface-200/30 pb-20 pt-0">
      <div className="flex flex-col gap-8 w-full max-w-4xl">
        {/* 캠페인 기본 정보 */}
        <Card className="flex flex-col gap-8 p-10 shadow-sm">
          <div className="border-l-3 border-text-auth-sub pl-4 py-1">
            <h3 className="font-heading4 text-text-title">캠페인 기본 정보</h3>
          </div>
          <div className="flex flex-col gap-10 w-full">
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
        <Card className="flex flex-col gap-8 p-10 shadow-sm">
          <div className="border-l-3 border-text-auth-sub pl-4 py-1">
            <h3 className="font-heading4 text-text-title">
              플랫폼별 캠페인 연결
            </h3>
          </div>
          <div className="flex flex-col gap-10">
            {/* Google */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-1">
                <GoogleIcon className="w-6 h-6" />
                <span className="font-body1 text-text-title">Google</span>
              </div>
              <DropdownSelect<IPlatformCampaign>
                placeholder="캠페인 선택"
                options={googleCampaigns}
                selectedOption={googleSelected}
                onSelect={setGoogleSelected}
                getOptionKey={(opt) => opt.adCampaignId}
                getOptionLabel={(opt) => opt.name}
              />
            </div>

            {/* NAVER */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-1">
                <NaverIcon className="w-6 h-6" />
                <span className="font-body1 text-text-title">NAVER</span>
              </div>
              <DropdownSelect<IPlatformCampaign>
                placeholder="캠페인 선택"
                options={naverCampaigns}
                selectedOption={naverSelected}
                onSelect={setNaverSelected}
                getOptionKey={(opt) => opt.adCampaignId}
                getOptionLabel={(opt) => opt.name}
              />
            </div>

            {/* Kakao */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-1">
                <KakaoIcon className="w-6 h-6" />
                <span className="font-body1 text-text-title">Kakao</span>
              </div>
              <DropdownSelect<IPlatformCampaign>
                placeholder="캠페인 선택"
                options={kakaoCampaigns}
                selectedOption={kakaoSelected}
                onSelect={setKakaoSelected}
                getOptionKey={(opt) => opt.adCampaignId}
                getOptionLabel={(opt) => opt.name}
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
          >
            {isCreating ? "생성 중..." : "완료"}
          </Button>
        </div>
      </div>
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        size="md"
      >
        <ModalContent
          icon={<WarnCircleIcon className="h-8 w-8 text-info-blue" />}
          title="캠페인 생성 완료"
          description="캠페인 그룹이 성공적으로 생성되었습니다."
          buttonText="확인"
          onConfirm={handleCloseSuccessModal}
          variant="primary"
        />
      </Modal>
    </section>
  );
}
