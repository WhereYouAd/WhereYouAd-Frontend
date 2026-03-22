import { useState } from "react";

import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import PageHeader from "@/components/common/PageHeader";
import DropdownSelect from "@/components/common/select/DropdownSelect";
import TextareaField from "@/components/common/textarea/TextareaField";

import GoogleLogo from "@/assets/logo/social-logo/wordmark/google-wordmark.svg?react";
import KakaoLogo from "@/assets/logo/social-logo/wordmark/kakao-wordmark.svg?react";
import NaverLogo from "@/assets/logo/social-logo/wordmark/naver-wordmark.svg?react";

interface ICampaignOption {
  id: number | string;
  name: string;
}
const MOCK_CAMPAIGNS: ICampaignOption[] = [
  { id: "none", name: "선택 안함" },
  { id: 1, name: "2026 새해맞이 병오년 캠페인" },
  { id: 2, name: "2025 연말 기념 캠페인" },
  { id: 3, name: "가을 프로모션 캠페인" },
  { id: 4, name: "벚꽃 프로모션 캠페인" },
];

export default function CampaignGroup() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [googleSelected, setGoogleSelected] = useState<ICampaignOption | null>(
    null,
  );
  const [naverSelected, setNaverSelected] = useState<ICampaignOption | null>(
    null,
  );
  const [kakaoSelected, setKakaoSelected] = useState<ICampaignOption | null>(
    null,
  );

  return (
    <section className="flex flex-col gap-12 w-full">
      <PageHeader
        title="캠페인 그룹 정보 설정"
        description="각 플랫폼에서 불러온 캠페인을 선택해 하나의 통합 캠페인으로 묶습니다."
      />

      <div className="flex flex-col gap-10 w-full">
        {/* 캠페인명 */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="campaign-name"
            className="font-heading4 text-text-main"
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
            className="font-heading4 text-text-main"
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

      <div className="flex flex-col gap-8 w-full">
        <h2 className="font-heading4 text-text-main">플랫폼별 캠페인 선택</h2>

        <div className="flex flex-col gap-10">
          {/* Google */}
          <div className="flex flex-col gap-2">
            <GoogleLogo className="h-7 w-auto self-start" />
            <DropdownSelect<ICampaignOption>
              placeholder="캠페인 선택"
              options={MOCK_CAMPAIGNS}
              selectedOption={googleSelected}
              onSelect={setGoogleSelected}
              getOptionKey={(opt) => opt.id}
              getOptionLabel={(opt) => opt.name}
            />
          </div>

          {/* NAVER */}
          <div className="flex flex-col gap-2">
            <NaverLogo className="h-4 w-auto self-start" />
            <DropdownSelect<ICampaignOption>
              placeholder="캠페인 선택"
              options={MOCK_CAMPAIGNS}
              selectedOption={naverSelected}
              onSelect={setNaverSelected}
              getOptionKey={(opt) => opt.id}
              getOptionLabel={(opt) => opt.name}
            />
          </div>

          {/* Kakao */}
          <div className="flex flex-col gap-2">
            <KakaoLogo className="h-6 w-auto self-start" />
            <DropdownSelect<ICampaignOption>
              placeholder="캠페인 선택"
              options={MOCK_CAMPAIGNS}
              selectedOption={kakaoSelected}
              onSelect={setKakaoSelected}
              getOptionKey={(opt) => opt.id}
              getOptionLabel={(opt) => opt.name}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-10 mt-10">
        <Button size="big" className="w-full max-w-40 py-4 font-bold">
          완료
        </Button>
      </div>
    </section>
  );
}
