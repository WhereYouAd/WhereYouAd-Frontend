import React, { memo } from "react";

import type { IPlatformPerformance } from "@/types/dashboard/platform";
import { PLATFORM_MAP } from "@/types/dashboard/platform";

import Card from "@/components/common/card/Card";
import StatCard from "@/components/common/card/StatCard";

import GoogleLogo from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import MetaLogo from "@/assets/logo/social-logo/circle/meta-circle.svg?react";
import NaverLogo from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

const PLATFORM_LOGOS: Record<string, React.ReactNode> = {
  GOOGLE: <GoogleLogo className="w-10 h-8" />,
  NAVER: <NaverLogo className="w-10 h-8" />,
  META: <MetaLogo className="w-10 h-8" />,
};

export const PlatformDetailCard = memo(
  ({ data }: { data: IPlatformPerformance }) => {
    const {
      provider,
      impressions,
      clicks,
      ROAS,
      impressionChangeRate,
      clickChangeRate,
      cvrChangeRate,
      ROASChangeRate,
    } = data;
    const ctr = (clicks / impressions) * 100;

    const innerCardClass =
      "shadow-none! hover:shadow-none! rounded-component-md! p-2! gap-2!";

    return (
      <Card className="flex-1 p-7 backdrop-blur-sm">
        {/* 로고 + 이름 */}
        <div className="flex items-center gap-2 mb-8">
          <div className="shrink-0">{PLATFORM_LOGOS[provider]}</div>
          <h3 className="font-heading4 font-semibold! text-text-main truncate">
            {PLATFORM_MAP[provider]}
          </h3>
        </div>

        {/* 지표 */}
        <div className="grid grid-cols-2 gap-2">
          <StatCard
            title="노출수"
            value={impressions.toLocaleString()}
            trend={{
              direction: impressionChangeRate > 0 ? "up" : "down",
              value: `${Math.abs(impressionChangeRate * 100).toFixed(1)}%`,
            }}
            className={innerCardClass}
          />
          <StatCard
            title="클릭수"
            value={clicks.toLocaleString()}
            trend={{
              direction: clickChangeRate > 0 ? "up" : "down",
              value: `${Math.abs(clickChangeRate * 100).toFixed(1)}%`,
            }}
            className={innerCardClass}
          />
          <StatCard
            title="클릭률"
            value={`${ctr.toFixed(1)}%`}
            trend={{
              direction: cvrChangeRate > 0 ? "up" : "down",
              value: `${Math.abs(cvrChangeRate * 100).toFixed(1)}%`,
            }}
            className={innerCardClass}
          />
          <StatCard
            title="ROAS"
            value={`${ROAS.toLocaleString()}%`}
            trend={{
              direction: ROASChangeRate > 0 ? "up" : "down",
              value: `${Math.abs(ROASChangeRate * 100).toFixed(1)}%`,
            }}
            className={innerCardClass}
          />
        </div>
      </Card>
    );
  },
);

export default PlatformDetailCard;
