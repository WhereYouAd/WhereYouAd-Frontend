import React, { memo } from "react";

import type { IPlatformPerformance } from "@/types/dashboard/platform";
import { PLATFORM_MAP } from "@/types/dashboard/platform";

import Card from "@/components/common/card/Card";
import { TrendBadge } from "@/components/common/card/StatCard";

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

    return (
      <Card className="flex-1 p-7 bg-white/80 backdrop-blur-sm">
        {/* 로고 + 이름 */}
        <div className="flex items-center gap-2 mb-8">
          <div className="shrink-0">{PLATFORM_LOGOS[provider]}</div>
          <h3 className="font-heading3 text-text-main truncate">
            {PLATFORM_MAP[provider]}
          </h3>
        </div>

        {/* 지표 */}
        <div className="grid grid-cols-2 gap-y-8 gap-x-4">
          <MetricItem
            label="노출수"
            value={impressions.toLocaleString()}
            rate={impressionChangeRate}
          />
          <MetricItem
            label="클릭수"
            value={clicks.toLocaleString()}
            rate={clickChangeRate}
          />
          <MetricItem
            label="클릭률"
            value={`${ctr.toFixed(1)}%`}
            rate={cvrChangeRate}
          />
          <MetricItem
            label="ROAS"
            value={`${ROAS.toLocaleString()}`}
            unit="%"
            rate={ROASChangeRate}
          />
        </div>
      </Card>
    );
  },
);

function MetricItem({
  label,
  value,
  unit,
  rate,
}: {
  label: string;
  value: string;
  unit?: string;
  rate?: number;
}) {
  const isUp = rate && rate > 0;

  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="font-body2 text-text-sub truncate">{label}</span>
      <div className="flex flex-col gap-2">
        <span className="font-heading2 text-text-main tabular-nums leading-tight">
          {value}
          <span className="text-body2 ml-0.5">{unit}</span>
        </span>
        {rate !== undefined && (
          <TrendBadge
            direction={isUp ? "up" : "down"}
            value={`${Math.abs(rate * 100).toFixed(1)}%`}
          />
        )}
      </div>
    </div>
  );
}

export default PlatformDetailCard;
