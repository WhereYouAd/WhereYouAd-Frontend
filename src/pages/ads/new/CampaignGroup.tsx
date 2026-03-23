import type { IPlatformCampaign } from "@/types/ads/campaign";

import { useCampaignGroup } from "@/hooks/ads/useCampaignGroup";

import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import Input from "@/components/common/input/Input";
import PageHeader from "@/components/common/PageHeader";
import DropdownSelect from "@/components/common/select/DropdownSelect";
import TextareaField from "@/components/common/textarea/TextareaField";

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
  } = useCampaignGroup();

  return (
    <section className="flex flex-col items-center w-full pt-0 pb-20 min-h-screen bg-bg-surface/30">
      <div className="flex flex-col gap-8 w-full max-w-4xl">
        <PageHeader
          title="캠페인 그룹 정보 설정"
          description="각 플랫폼의 동일한 캠페인들을 그룹으로 묶어, 플랫폼 경계 없이 하나의 통합 캠페인으로 관리하세요."
        />

        {/* 캠페인 기본 정보 */}
        <Card className="flex flex-col gap-8 p-10 shadow-sm bg-white">
          <div className="border-l-3 border-text-auth-sub pl-4 py-1">
            <h3 className="font-heading4 text-text-main">캠페인 기본 정보</h3>
          </div>
          <div className="flex flex-col gap-10 w-full">
            {/* 캠페인명 */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="campaign-name"
                className="font-body1 text-text-main"
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
                className="font-body1 text-text-main"
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
                className="bg-white ring-1 ring-logo-1/30 hover:ring-logo-1/40 focus:ring-2 focus:ring-logo-1/50"
              />
            </div>
          </div>
        </Card>

        {/* 플랫폼별 캠페인 연결 */}
        <Card className="flex flex-col gap-8 p-10 shadow-sm bg-white">
          <div className="border-l-3 border-text-auth-sub pl-4 py-1">
            <h3 className="font-heading4 text-text-main">
              플랫폼별 캠페인 연결
            </h3>
          </div>
          <div className="flex flex-col gap-10">
            {/* Google */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-1">
                <GoogleIcon className="w-6 h-6" />
                <span className="font-body1 text-text-main">Google</span>
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
                <span className="font-body1 text-text-main">NAVER</span>
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
                <span className="font-body1 text-text-main">Kakao</span>
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
          <Button size="big" className="w-full max-w-40 py-4 font-bold">
            완료
          </Button>
        </div>
      </div>
    </section>
  );
}
