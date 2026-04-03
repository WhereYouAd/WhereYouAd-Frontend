import React, { memo } from "react";

import type { IRoasRanking } from "@/types/dashboard/platform";
import { PLATFORM_MAP } from "@/types/dashboard/platform";

import { TrendBadge } from "@/components/common/card/StatCard";

import GoogleLogo from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import MetaLogo from "@/assets/logo/social-logo/circle/meta-circle.svg?react";
import NaverLogo from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

interface ITopPerformanceListProps {
  rankings: IRoasRanking[];
}

const PlatformInfo: Record<string, { name: string; logo: React.ReactNode }> = {
  GOOGLE: {
    name: PLATFORM_MAP.GOOGLE,
    logo: <GoogleLogo className="w-8 h-8" />,
  },
  NAVER: { name: PLATFORM_MAP.NAVER, logo: <NaverLogo className="w-8 h-8" /> },
  META: { name: PLATFORM_MAP.META, logo: <MetaLogo className="w-8 h-8" /> },
};

export const TopPerformanceList = memo(function TopPerformanceList({
  rankings,
}: ITopPerformanceListProps) {
  return (
    <div className="flex flex-col gap-5 w-full mt-8">
      {rankings.map((item) => {
        const info = PlatformInfo[item.provider] || {
          name: item.provider,
          logo: null,
        };
        const diffRate = item.diffRate ?? 0;
        const isUp = diffRate >= 0;

        return (
          <div key={item.provider} className="flex items-center gap-4 w-full">
            <div className="flex flex-1 items-center gap-4 min-w-0">
              <div className="shrink-0">{info.logo}</div>
              <span className="font-body1 text-text-main truncate">
                {info.name}
              </span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="font-heading4 text-text-main tabular-nums whitespace-nowrap">
                {item.roas.toFixed(2)}%
              </span>
              <TrendBadge
                direction={isUp ? "up" : "down"}
                value={`${Math.abs(diffRate)}%`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
});
export default TopPerformanceList;
