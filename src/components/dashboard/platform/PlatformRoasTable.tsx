import Badge from "@/components/common/badge/Badge";

import { platformRoasRanking } from "./platformComparison.mock";

import GoogleLogo from "@/assets/icon/ads/google-circle.svg?react";
import KakaoLogo from "@/assets/icon/ads/kakao-circle.svg?react";
import NaverLogo from "@/assets/icon/ads/naver-circle.svg?react";

const platformLogoMap = {
  Google: <GoogleLogo className="h-7 w-auto" />,
  NAVER: <NaverLogo className="h-7 w-auto" />,
  Kakao: <KakaoLogo className="h-7 w-auto" />,
};

const maxRoas = Math.max(...platformRoasRanking.map((p) => p.roas));

function roasBarColor(roas: number) {
  if (roas >= 200) return "#059669";
  if (roas >= 100) return "#0084fe";
  return "#DC2626";
}

function Delta({ value }: { value: number }) {
  const isPos = value >= 0;
  return (
    <Badge
      variant={isPos ? "success" : "inactive"}
      size="sm"
      className="font-caption h-auto px-2 py-0.5 shrink-0"
    >
      {isPos ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
    </Badge>
  );
}

const COL = "grid-cols-[40px_2fr_3fr_1.5fr_1.5fr_2fr]";

export default function PlatformRoasTable() {
  return (
    <div className="flex flex-col h-full font-pretendard">
      <div className="flex flex-col flex-1 overflow-x-auto">
        <div
          className={`grid ${COL} gap-x-4 px-4 pb-3 font-caption text-text-auth-sub uppercase tracking-widest`}
          style={{ borderBottom: "1px solid #F3F4F6" }}
        >
          <span className="text-center">#</span>
          <span>플랫폼</span>
          <span>ROAS(%)</span>
          <span className="text-right">CTR</span>
          <span className="text-right">전환율</span>
          <span className="text-right whitespace-nowrap">매출 / 광고비</span>
        </div>

        <div className="flex flex-col">
          {platformRoasRanking.map((platform, index) => (
            <div
              key={platform.name}
              className={`group grid ${COL} gap-x-4 items-center px-4 min-h-24 cursor-default transition-all duration-150 ease-in-out hover:bg-[#F9FAFB]`}
              style={{
                borderBottom:
                  index < platformRoasRanking.length - 1
                    ? "1px solid #F3F4F6"
                    : "none",
              }}
            >
              <span className="text-center font-caption font-bold text-text-auth-sub/50 group-hover:text-text-auth-sub transition-colors">
                {index + 1}
              </span>

              <div className="flex items-center gap-3">
                <div className="shrink-0 p-1.5 rounded-full bg-bg-surface ring-1 ring-gray-100/80 group-hover:scale-105 transition-transform duration-150">
                  {platformLogoMap[platform.name]}
                </div>
                <span className="font-body1 font-bold text-text-main tracking-tight">
                  {platform.name}
                </span>
              </div>

              <div className="flex items-center gap-2.5 pr-2">
                <span className="font-label text-text-main w-13 shrink-0 tabular-nums">
                  {platform.roas}%
                </span>

                <div
                  className="flex-1 h-0.75 rounded-full overflow-hidden"
                  style={{ background: "#F1F5F9" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(platform.roas / maxRoas) * 100}%`,
                      backgroundColor: roasBarColor(platform.roas),
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 text-right">
                <span className="font-label text-text-main leading-none tabular-nums">
                  {platform.clickRate}%
                </span>
                <Delta value={platform.ctrDelta} />
              </div>

              <div className="flex items-center justify-end gap-2 text-right">
                <span className="font-label text-text-main leading-none tabular-nums">
                  {platform.conversionRate}%
                </span>
                <Delta value={platform.conversionDelta} />
              </div>

              <div className="flex flex-col items-end justify-center gap-1 text-right">
                <span className="font-body1 font-bold text-text-main tracking-tight leading-none tabular-nums">
                  ₩{platform.revenue.toLocaleString()}
                </span>
                <span className="font-caption text-text-sub tracking-tight leading-none tabular-nums">
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
