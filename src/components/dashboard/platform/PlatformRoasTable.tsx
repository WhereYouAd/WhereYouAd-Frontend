import { memo } from "react";

import type { IPlatformRankingItem } from "@/types/dashboard/overview";

import { TrendBadge } from "@/components/common/card/StatCard";

import GoogleLogo from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import KakaoLogo from "@/assets/logo/social-logo/circle/kakao-circle.svg?react";
import NaverLogo from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

const platformLogoMap = {
  Google: <GoogleLogo className="h-7 w-auto" />,
  NAVER: <NaverLogo className="h-7 w-auto" />,
  Kakao: <KakaoLogo className="h-7 w-auto" />,
};

type TPlatformName = keyof typeof platformLogoMap;

const providerDisplayMap: Record<string, string> = {
  GOOGLE: "Google",
  NAVER: "NAVER",
  KAKAO: "Kakao",
};

function getDisplayName(provider: string): string {
  return providerDisplayMap[provider.toUpperCase()] ?? provider;
}

function getPlatformLogo(provider: string) {
  const name = getDisplayName(provider);
  if (name in platformLogoMap) {
    return platformLogoMap[name as TPlatformName];
  }
  return (
    <span className="h-7 w-7 rounded-full bg-bg-disabled flex items-center justify-center text-xs font-bold">
      {name[0]}
    </span>
  );
}

const Delta = memo(function Delta({ value }: { value: number }) {
  const isPos = value >= 0;
  return (
    <TrendBadge
      direction={isPos ? "up" : "down"}
      value={`${Math.abs(value).toFixed(1)}%`}
    />
  );
});

export const PLATFORM_ROAS_TABLE_COL =
  "grid-cols-[36px_minmax(0,1.45fr)_minmax(5.5rem,7.25rem)_minmax(0,1.25fr)] @2xl:grid-cols-[36px_minmax(0,1.15fr)_minmax(5.5rem,7.25rem)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.28fr)]";

interface IPlatformRoasTableProps {
  rankings: IPlatformRankingItem[];
}

const PlatformRoasTable = memo(function PlatformRoasTable({
  rankings,
}: IPlatformRoasTableProps) {
  return (
    <div className="@container flex flex-col h-full font-pretendard w-full">
      <div className="flex flex-col flex-1 min-w-0">
        <div
          className={`grid ${PLATFORM_ROAS_TABLE_COL} items-center gap-x-4 @2xl:gap-x-6 px-4 pt-2 pb-4 font-caption text-[#8B95A1] font-medium tracking-wider uppercase border-b border-[#F2F4F6]`}
        >
          <span className="flex min-h-[1.25rem] items-center justify-center text-center tabular-nums leading-snug">
            순위
          </span>
          <span className="min-w-0 leading-snug">플랫폼</span>
          <span className="flex min-h-[1.25rem] items-center justify-center px-2 tabular-nums leading-snug @2xl:px-3">
            ROAS(%)
          </span>
          <span className="hidden min-w-0 pl-1 text-center leading-snug @2xl:block @2xl:pl-0">
            CTR(클릭률)
          </span>
          <span className="hidden min-w-0 text-center leading-snug @2xl:block">
            CVR(전환율)
          </span>
          <span className="min-w-0 whitespace-nowrap text-right leading-snug">
            매출 / 광고비
          </span>
        </div>

        {rankings.length === 0 && (
          <div className="flex items-center justify-center py-16 text-text-disabled font-body2">
            플랫폼 데이터가 없습니다.
          </div>
        )}
        <div className="flex flex-col pb-2 divide-y divide-[#F2F4F6]">
          {rankings.map((item) => (
            <div
              key={item.provider}
              className={`group grid ${PLATFORM_ROAS_TABLE_COL} items-stretch gap-x-4 @2xl:gap-x-6 px-4 py-4 min-h-20 cursor-default rounded-lg transition-colors duration-300 hover:bg-[#F2F4F6]`}
            >
              {/* 순위 */}
              <div className="flex min-h-0 min-w-0 items-center justify-center">
                <span className="text-center font-caption font-bold leading-none text-text-disabled tabular-nums transition-colors group-hover:text-text-sub">
                  {item.rank}
                </span>
              </div>

              {/* 플랫폼 이름 */}
              <div className="flex min-h-0 min-w-0 items-center gap-3">
                <div className="shrink-0 p-1.5 hover:will-change-transform group-hover:scale-105">
                  {getPlatformLogo(item.provider)}
                </div>
                <span className="font-body1 font-semibold! text-text-main tracking-tight">
                  {getDisplayName(item.provider)}
                </span>
              </div>

              {/* ROAS */}
              <div className="flex h-full min-h-0 w-full min-w-0 items-center justify-center px-2 @2xl:px-3">
                <span className="font-body1 leading-none text-text-main tabular-nums tracking-tight">
                  {item.roas.toLocaleString()}%
                </span>
              </div>

              {/* CTR */}
              <div className="hidden min-w-0 flex-col items-center justify-start gap-1.5 pl-1 text-center @2xl:flex @2xl:pl-0">
                {item.clickRate !== undefined ? (
                  <>
                    <span className="w-full font-body1 text-text-main tracking-tight leading-none tabular-nums text-center">
                      {item.clickRate.toFixed(1)}%
                    </span>
                    {item.ctrDelta !== undefined && (
                      <div className="flex w-full justify-center scale-[0.85] opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        <Delta value={item.ctrDelta} />
                      </div>
                    )}
                  </>
                ) : (
                  <span className="font-body1 text-text-disabled">-</span>
                )}
              </div>

              {/* CVR */}
              <div className="hidden min-w-0 flex-col items-center justify-start gap-1.5 text-center @2xl:flex">
                {item.conversionRate !== undefined ? (
                  <>
                    <span className="w-full font-body1 text-text-main tracking-tight leading-none tabular-nums text-center">
                      {item.conversionRate.toFixed(1)}%
                    </span>
                    {item.conversionDelta !== undefined && (
                      <div className="flex w-full justify-center scale-[0.85] opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        <Delta value={item.conversionDelta} />
                      </div>
                    )}
                  </>
                ) : (
                  <span className="font-body1 text-text-disabled">-</span>
                )}
              </div>

              {/* 매출/광고비 */}
              <div className="flex w-full min-w-0 flex-col items-end justify-start gap-2 text-right">
                <span className="font-heading4 font-semibold! text-text-main tracking-tight leading-none tabular-nums truncate w-full">
                  ₩{item.revenue.toLocaleString()}
                </span>
                <div className="flex items-center justify-end gap-1.5 text-[#8B95A1] font-caption w-full transition-colors group-hover:text-text-sub">
                  <span className="font-medium whitespace-nowrap">광고비</span>
                  <span className="tabular-nums truncate">
                    ₩{item.adSpend.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default PlatformRoasTable;
