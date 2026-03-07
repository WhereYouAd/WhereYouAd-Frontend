import { platformRoasRanking } from "./platformComparison.mock";

import GoogleLogo from "@/assets/icon/ads/google-circle.svg?react";
import KakaoLogo from "@/assets/icon/ads/kakao-circle.svg?react";
import NaverLogo from "@/assets/icon/ads/naver-circle.svg?react";

const platformLogoMap = {
  Google: <GoogleLogo className="h-7 w-auto" />,
  NAVER: <NaverLogo className="h-7 w-auto" />,
  kakao: <KakaoLogo className="h-7 w-auto" />,
};

export default function PlatformRoasTable() {
  return (
    <div>
      <h4 className="font-body1 text-text-main font-semibold">
        성과 순위 (ROAS 기준)
      </h4>
      <p className="font-caption text-text-sub mt-0.5">
        ROAS = 매출 / 광고비 × 100
      </p>

      <div className="mt-4">
        <div className="grid grid-cols-[2.5rem_3.5rem_6rem_1fr] gap-5 pb-3 font-caption text-text-sub">
          <span className="text-center">순위</span>
          <span className="text-center">플랫폼</span>
          <span className="text-center">ROAS</span>
          <span>매출/광고비</span>
        </div>
        <div className="h-px bg-bg-surface" />
        {platformRoasRanking.map((platform, index) => (
          <div key={platform.name}>
            <div className="grid grid-cols-[2.5rem_3.5rem_6rem_1fr] gap-5 py-4 items-center">
              <span className="font-body2 text-text-sub text-center">
                {index + 1}
              </span>
              <span className="flex justify-center">
                {platformLogoMap[platform.name]}
              </span>
              <span className="font-body2 text-text-main text-center">
                {platform.roas}%
              </span>
              <span className="font-body2 text-text-sub">
                {platform.revenue.toLocaleString()} /{" "}
                {platform.adCost.toLocaleString()}
              </span>
            </div>
            {index < platformRoasRanking.length - 1 && (
              <div className="h-px bg-bg-surface" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
