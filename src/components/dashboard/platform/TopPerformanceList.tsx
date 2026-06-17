import { memo } from "react";

import type { IRoasRanking } from "@/types/dashboard/platform";
import { PLATFORM_MAP, type TProviderType } from "@/types/dashboard/provider";
import { PLATFORM_CIRCLE_LOGO_MAP } from "@/constants/dashboard/platformLogos";

import { TrendBadge } from "@/components/common/card/StatCard";

function toProviderType(provider: string): TProviderType | null {
  const key = provider.toUpperCase();
  if (key in PLATFORM_MAP) return key as TProviderType;
  return null;
}

interface ITopPerformanceListProps {
  rankings: IRoasRanking[];
}

export const TopPerformanceList = memo(function TopPerformanceList({
  rankings,
}: ITopPerformanceListProps) {
  return (
    <div className="flex-1 flex flex-col justify-center gap-6 w-full pt-3">
      {rankings.map((item) => {
        const key = toProviderType(item.provider);
        const Logo = key ? PLATFORM_CIRCLE_LOGO_MAP[key] : null;
        const name = key ? PLATFORM_MAP[key] : item.provider;

        return (
          <div key={item.provider} className="flex items-center gap-4 w-full">
            <div className="flex flex-1 items-center gap-4 min-w-0">
              <span className="font-body1 text-text-muted w-4 shrink-0">
                {item.rank}
              </span>
              <div className="shrink-0" aria-hidden="true">
                {Logo && <Logo className="w-8 h-8" />}
              </div>
              <span className="font-body1 text-text-title truncate">
                {name}
              </span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="font-heading4 text-text-title tabular-nums whitespace-nowrap">
                {item.roas.toFixed(2)}%
              </span>
              {item.diffRate !== null && item.diffRate !== 0 && (
                <TrendBadge
                  direction={item.diffRate > 0 ? "up" : "down"}
                  value={`${Math.abs(item.diffRate)}%`}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});
export default TopPerformanceList;
