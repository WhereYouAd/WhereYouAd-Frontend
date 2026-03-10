import { platformRoasRanking } from "./platformComparison.mock";

import GoogleLogo from "@/assets/icon/ads/google-circle.svg?react";
import KakaoLogo from "@/assets/icon/ads/kakao-circle.svg?react";
import NaverLogo from "@/assets/icon/ads/naver-circle.svg?react";

const platformLogoMap = {
  Google: <GoogleLogo className="h-6 w-auto" />,
  NAVER: <NaverLogo className="h-6 w-auto" />,
  kakao: <KakaoLogo className="h-6 w-auto" />,
};

export default function PlatformRoasTable() {
  return (
    <div className="flex flex-col h-full font-pretendard">
      <div className="flex items-center justify-between mb-8">
        <h4 className="font-body2 text-text-main font-extrabold tracking-tight">
          성과 순위
        </h4>
        <div className="bg-bg-surface/30 px-3 py-1.5 rounded-full border border-bg-surface hover:bg-bg-surface/50 transition-colors">
          <p className="font-caption font-semibold text-text-sub text-[13px] tracking-tight">
            ROAS(%) = 매출 ÷ 광고비 × 100
          </p>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="grid grid-cols-[28px_1fr_4.5rem_auto] gap-x-4 sm:gap-x-6 px-4 mb-3 font-caption text-text-placeholder uppercase tracking-widest font-bold text-xs pb-3 border-b border-bg-surface">
          <span className="text-center">#</span>
          <span>플랫폼</span>
          <span className="text-right">ROAS(%)</span>
          <span className="text-right whitespace-nowrap min-w-22">
            매출 / 광고비
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {platformRoasRanking.map((platform, index) => (
            <div
              key={platform.name}
              className="group grid grid-cols-[28px_1fr_4.5rem_auto] gap-x-4 sm:gap-x-6 items-center px-4 py-3.5 rounded-xl cursor-default hover:bg-white/40 dark:hover:bg-bg-surface/40 hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-transparent hover:border-white/60 dark:hover:border-white/10 transition-all duration-300"
            >
              <span className="text-center font-bold text-text-auth-sub/60 group-hover:text-text-main transition-colors text-[14px]">
                {index + 1}
              </span>

              <div className="flex items-center gap-3">
                <div className="shrink-0 drop-shadow-sm group-hover:scale-105 transition-transform">
                  {platformLogoMap[platform.name]}
                </div>
                <span className="text-text-main font-bold tracking-tight text-[15px]">
                  {platform.name}
                </span>
              </div>

              <span className="text-right text-text-main font-extrabold tracking-tight text-[15px]">
                {platform.roas}%
              </span>

              <div className="flex flex-col items-end justify-center min-w-22">
                <span className="font-extrabold text-text-main tracking-tight leading-none text-[15px] mb-0.75">
                  ₩{platform.revenue.toLocaleString()}
                </span>
                <span className="text-[12px] font-semibold text-text-sub opacity-70 tracking-tight leading-none">
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
