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

function roasStatusClass(roas: number) {
  if (roas >= 200) return "bg-status-green";
  if (roas >= 100) return "bg-status-blue";
  return "bg-status-red";
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

const COL =
  "grid-cols-[32px_1.5fr_2.5fr_1.5fr] @2xl:grid-cols-[32px_1.5fr_2.5fr_1fr_1fr_1.5fr]";

interface IPlatformRoasTableProps {
  rankings: IPlatformRankingItem[];
}

const PlatformRoasTable = memo(function PlatformRoasTable({
  rankings,
}: IPlatformRoasTableProps) {
  const maxRoas =
    rankings.length > 0 ? Math.max(...rankings.map((r) => r.roas)) : 1;

  return (
    <div className="@container flex flex-col h-full font-pretendard w-full">
      <div className="flex flex-col flex-1 min-w-0">
        {/* 헤더 */}
        <div
          className={`grid ${COL} gap-x-4 px-4 pt-2 pb-4 font-caption text-[#8B95A1] font-medium tracking-wider uppercase border-b border-[#F2F4F6]`}
        >
          <span className="text-center">순위</span>
          <span className="text-left">플랫폼</span>
          <span className="text-left">ROAS(%)</span>
          <span className="hidden @2xl:block text-center">CTR(클릭률)</span>
          <span className="hidden @2xl:block text-center">CVR(전환율)</span>
          <span className="text-right whitespace-nowrap">매출 / 광고비</span>
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
              className={`group grid ${COL} gap-x-4 items-center px-4 py-4 min-h-20 cursor-default rounded-component-sm transition-colors duration-300 hover:bg-[#F2F4F6]`}
            >
              {/* 순위 */}
              <span className="text-center font-caption font-bold text-text-disabled group-hover:text-text-sub transition-colors tabular-nums">
                {item.rank}
              </span>

              {/* 플랫폼 이름 */}
              <div className="flex items-center gap-3">
                <div className="shrink-0 p-1.5 hover:will-change-transform group-hover:scale-105">
                  {getPlatformLogo(item.provider)}
                </div>
                <span className="font-body1 font-bold text-text-main tracking-tight">
                  {getDisplayName(item.provider)}
                </span>
              </div>

              {/* ROAS 수치 + 가로 바 */}
              <div className="flex flex-col justify-center gap-2 pr-4">
                <span className="font-heading4 font-extrabold text-text-main tracking-tight tabular-nums leading-none">
                  {item.roas.toLocaleString()}%
                </span>
                <div className="w-full h-1.5 rounded-full overflow-hidden bg-bg-disabled/40 group-hover:bg-[#E5E8EB] transition-colors duration-300">
                  <div
                    className={`h-full rounded-full transition-colors duration-700 ease-out ${roasStatusClass(item.roas)}`}
                    style={{
                      width: `${Math.min((item.roas / maxRoas) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* CTR */}
              <div className="hidden @2xl:flex flex-col items-center justify-center gap-1.5 w-full">
                {item.clickRate !== undefined ? (
                  <>
                    <span className="font-body1 font-bold text-text-main tracking-tight leading-none tabular-nums">
                      {item.clickRate.toFixed(1)}%
                    </span>
                    {item.ctrDelta !== undefined && (
                      <div className="scale-[0.85] opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        <Delta value={item.ctrDelta} />
                      </div>
                    )}
                  </>
                ) : (
                  <span className="font-body1 text-text-disabled">-</span>
                )}
              </div>

              {/* CVR */}
              <div className="hidden @2xl:flex flex-col items-center justify-center gap-1.5 w-full">
                {item.conversionRate !== undefined ? (
                  <>
                    <span className="font-body1 font-bold text-text-main tracking-tight leading-none tabular-nums">
                      {item.conversionRate.toFixed(1)}%
                    </span>
                    {item.conversionDelta !== undefined && (
                      <div className="scale-[0.85] opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        <Delta value={item.conversionDelta} />
                      </div>
                    )}
                  </>
                ) : (
                  <span className="font-body1 text-text-disabled">-</span>
                )}
              </div>

              {/* 매출/광고비 */}
              <div className="flex flex-col items-end justify-center gap-2 text-right w-full">
                <span className="font-heading4 font-bold text-text-main tracking-tight leading-none tabular-nums truncate w-full">
                  ₩{item.revenue.toLocaleString()}
                </span>
                <div className="flex items-center justify-end gap-1.5 text-[#8B95A1] font-caption w-full transition-colors group-hover:text-text-sub">
                  <span className="font-medium whitespace-nowrap">광고비</span>
                  <span className="tabular-nums font-bold truncate">
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
