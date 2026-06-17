import { memo } from "react";

import type { IRoasRanking } from "@/types/dashboard/platform";
import { PLATFORM_MAP } from "@/types/dashboard/provider";
import { PLATFORM_CIRCLE_LOGO_MAP } from "@/constants/dashboard/platformLogos";

import { TrendBadge } from "@/components/common/card/StatCard";

interface ITopPerformanceListProps {
  rankings: IRoasRanking[];
}

export const TopPerformanceList = memo(function TopPerformanceList({
  rankings,
}: ITopPerformanceListProps) {
  return (
    <div className="flex-1 flex flex-col justify-center gap-6 w-full pt-3">
      {rankings.map((item) => {
        const Logo =
          PLATFORM_CIRCLE_LOGO_MAP[
            item.provider as keyof typeof PLATFORM_CIRCLE_LOGO_MAP
          ];
        const name =
          PLATFORM_MAP[item.provider as keyof typeof PLATFORM_MAP] ??
          item.provider;

        return (
          <div key={item.provider} className="flex items-center gap-4 w-full">
            <div className="flex flex-1 items-center gap-4 min-w-0">
              <span className="font-body1 text-text-muted w-4 shrink-0">
                {item.rank}
              </span>
              <div className="shrink-0">
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
