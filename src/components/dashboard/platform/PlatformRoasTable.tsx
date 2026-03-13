import { TrendBadge } from "@/components/common/card/StatCard";

import { platformRoasRanking } from "./platformComparison.mock";

import GoogleLogo from "@/assets/icon/ads/google-circle.svg?react";
import KakaoLogo from "@/assets/icon/ads/kakao-circle.svg?react";
import NaverLogo from "@/assets/icon/ads/naver-circle.svg?react";

// 플랫폼 로고 컴포넌트 매핑
const platformLogoMap = {
  Google: <GoogleLogo className="h-7 w-auto" />,
  NAVER: <NaverLogo className="h-7 w-auto" />,
  Kakao: <KakaoLogo className="h-7 w-auto" />,
};

// 바 차트 비율 계산용 최대 ROAS
const maxRoas = Math.max(...platformRoasRanking.map((p) => p.roas));

// ROAS 수치에 따라 배경색 유틸리티 클래스 반환
function roasStatusClass(roas: number) {
  if (roas >= 200) return "bg-status-green";
  if (roas >= 100) return "bg-status-blue";
  return "bg-status-red";
}

// 증감률 뱃지 컴포넌트
function Delta({ value }: { value: number }) {
  const isPos = value >= 0;
  return (
    <TrendBadge
      direction={isPos ? "up" : "down"}
      value={`${Math.abs(value).toFixed(1)}%`}
    />
  );
}

// 테이블 그리드 컬럼 레이아웃
const COL =
  "grid-cols-[48px_minmax(120px,1.5fr)_minmax(180px,2.5fr)_minmax(100px,1.2fr)_minmax(100px,1.2fr)_minmax(180px,2fr)]";

export default function PlatformRoasTable() {
  return (
    <div className="flex flex-col h-full font-pretendard w-full">
      <div className="flex flex-col flex-1 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div
          className={`grid ${COL} gap-x-6 px-4 pt-2 pb-4 font-caption text-[#8B95A1] font-medium tracking-wider uppercase mb-2 border-b border-[#F2F4F6]`}
        >
          <span className="text-center">#</span>
          <span className="text-left">Platform</span>
          <span className="text-left">ROAS(%)</span>
          <span className="text-right">CTR</span>
          <span className="text-right">CVR</span>
          <span className="text-right whitespace-nowrap">Revenue / Cost</span>
        </div>

        <div className="flex flex-col gap-1.5 pb-2">
          {platformRoasRanking.map((platform, index) => (
            <div
              key={platform.name}
              className={`group grid ${COL} gap-x-6 items-center px-4 py-4 min-h-24 cursor-default rounded-2xl transition-all duration-300 hover:bg-[#F2F4F6]`}
            >
              {/* 순위 */}
              <span className="text-center font-caption font-bold text-text-disabled group-hover:text-text-sub transition-colors tabular-nums">
                {index + 1}
              </span>

              {/* 플랫폼 이름 */}
              <div className="flex items-center gap-4">
                <div className="shrink-0 p-1.5 rounded-full bg-white ring-1 ring-bg-disabled/40 shadow-sm group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300">
                  {
                    platformLogoMap[
                      platform.name as keyof typeof platformLogoMap
                    ]
                  }
                </div>
                <span className="font-body1 font-bold text-text-main tracking-tight">
                  {platform.name}
                </span>
              </div>

              {/* ROAS 수치 + 가로 바 */}
              <div className="flex flex-col justify-center gap-2 pr-6">
                <span className="font-heading4 font-extrabold text-text-main tracking-tight tabular-nums leading-none">
                  {platform.roas.toLocaleString()}%
                </span>
                <div className="w-full h-1.5 rounded-full overflow-hidden bg-bg-disabled/40 group-hover:bg-[#E5E8EB] transition-colors duration-300">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${roasStatusClass(platform.roas)}`}
                    style={{
                      width: `${Math.min((platform.roas / maxRoas) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* CTR + 전기 대비 증감 */}
              <div className="flex flex-col items-end justify-center gap-1.5 text-right w-full">
                <span className="font-body1 font-bold text-text-main tracking-tight leading-none tabular-nums">
                  {platform.clickRate.toLocaleString()}%
                </span>
                <div className="origin-right scale-[0.85] opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  <Delta value={platform.ctrDelta} />
                </div>
              </div>

              {/* 전환율 + 전기 대비 증감 */}
              <div className="flex flex-col items-end justify-center gap-1.5 text-right w-full">
                <span className="font-body1 font-bold text-text-main tracking-tight leading-none tabular-nums">
                  {platform.conversionRate.toLocaleString()}%
                </span>
                <div className="origin-right scale-[0.85] opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  <Delta value={platform.conversionDelta} />
                </div>
              </div>

              {/* 매출/광고비 */}
              <div className="flex flex-col items-end justify-center gap-2 text-right w-full">
                <span className="font-heading4 font-bold text-text-main tracking-tight leading-none tabular-nums truncate w-full">
                  ₩{platform.revenue.toLocaleString()}
                </span>
                <div className="flex items-center justify-end gap-1.5 text-[#8B95A1] font-caption w-full transition-colors group-hover:text-text-sub">
                  <span className="font-medium whitespace-nowrap">광고비</span>
                  <span className="tabular-nums font-bold truncate">
                    ₩{platform.adCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
