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
    <div className="flex flex-col h-full font-pretendard">
      <div className="flex flex-col gap-1 mb-8">
        <h4 className="font-body2 text-text-main font-extrabold tracking-tight">
          성과 순위
        </h4>
        <p className="font-caption text-text-placeholder font-medium">
          ROAS(%) = 매출 ÷ 광고비 × 100
        </p>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-[2.5rem_9rem_5rem_1fr] gap-4 px-3 mb-3 font-caption font-bold text-text-placeholder uppercase tracking-wider">
          <span className="text-center">순위</span>
          <span>플랫폼</span>
          <span className="text-right">ROAS(%)</span>
          <span className="text-right whitespace-nowrap">매출 / 광고비</span>
        </div>

        <div className="flex flex-col gap-1.5 overflow-visible">
          {platformRoasRanking.map((platform, index) => (
            <div
              key={platform.name}
              className="grid grid-cols-[2.5rem_9rem_5rem_1fr] gap-4 items-center px-3 py-4 rounded-component-lg cursor-default hover:bg-bg-surface transition-colors duration-200"
            >
              <span className="text-center font-extrabold text-text-placeholder font-body1">
                {index + 1}
              </span>
              <div className="flex items-center gap-3">
                <div className="shrink-0">{platformLogoMap[platform.name]}</div>
                <span className="font-bold text-text-main font-body1 tracking-tight">
                  {platform.name}
                </span>
              </div>
              <span className="text-right font-black text-text-main font-body1 tracking-tighter">
                {platform.roas}%
              </span>
              <div className="flex flex-col items-end text-right">
                <span className="font-body2 font-extrabold text-text-main leading-tight">
                  ₩{platform.revenue.toLocaleString()}
                </span>
                <span className="font-caption font-medium text-text-sub opacity-70 tracking-tight">
                  ₩{platform.adCost.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
