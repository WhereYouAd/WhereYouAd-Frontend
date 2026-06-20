import React, { memo } from "react";

import type { IPlatformPerformance } from "@/types/dashboard/platform";
import { PLATFORM_MAP } from "@/types/dashboard/provider";

import {
  formatPercentDeltaCompact,
  METRIC_REGISTRY as M,
} from "@/utils/dashboard/metricRegistry";

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
      conversion,
      ROAS,
      impressionChangeRate,
      clickChangeRate,
      cvrChangeRate,
      ROASChangeRate,
    } = data;

    const innerCardClass =
      "shadow-none! hover:shadow-none! !rounded-2xl p-2! gap-2!";

    return (
      <Card className="flex-1 p-7">
        {/* 로고 + 이름 */}
        <div className="flex items-center gap-2 mb-8">
          <div className="shrink-0">{PLATFORM_LOGOS[provider]}</div>
          <h3 className="font-heading4 text-text-title truncate">
            {PLATFORM_MAP[provider]}
          </h3>
        </div>

        {/* 지표 */}
        <div className="grid grid-cols-2 gap-2">
          <StatCard
            title={M.impressions.label}
            value={M.impressions.format(impressions)}
            trend={
              impressionChangeRate !== 0
                ? {
                    direction: impressionChangeRate > 0 ? "up" : "down",
                    value: formatPercentDeltaCompact(impressionChangeRate),
                  }
                : undefined
            }
            className={innerCardClass}
          />
          <StatCard
            title={M.clicks.label}
            value={M.clicks.format(clicks)}
            trend={
              clickChangeRate !== 0
                ? {
                    direction: clickChangeRate > 0 ? "up" : "down",
                    value: formatPercentDeltaCompact(clickChangeRate),
                  }
                : undefined
            }
            className={innerCardClass}
          />
          <StatCard
            title={M.conversion.kpiLabel}
            value={M.conversion.formatCard(conversion)}
            trend={
              cvrChangeRate !== 0
                ? {
                    direction: cvrChangeRate > 0 ? "up" : "down",
                    value: M.conversion.formatDeltaCompact(cvrChangeRate),
                  }
                : undefined
            }
            className={innerCardClass}
          />
          <StatCard
            title={M.roas.label}
            value={M.roas.formatGrouped(ROAS)}
            trend={
              ROASChangeRate !== 0
                ? {
                    direction: ROASChangeRate > 0 ? "up" : "down",
                    value: formatPercentDeltaCompact(ROASChangeRate),
                  }
                : undefined
            }
            className={innerCardClass}
          />
        </div>
      </Card>
    );
  },
);

export default PlatformDetailCard;
