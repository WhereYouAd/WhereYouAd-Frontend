import React, { memo, useMemo } from "react";

import type { IPlatformPerformance } from "@/types/dashboard/platform";
import { PLATFORM_MAP } from "@/types/dashboard/provider";

import { metricsToKpis } from "@/utils/dashboard/metricsToKpis";

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
    const { provider } = data;
    const kpis = useMemo(() => metricsToKpis(data), [data]);

    const innerCardClass =
      "shadow-none! hover:shadow-none! !rounded-2xl p-2! gap-2!";

    return (
      <Card className="flex-1 p-7">
        <div className="mb-8 flex items-center gap-2">
          <div className="shrink-0">{PLATFORM_LOGOS[provider]}</div>
          <h3 className="truncate font-heading4 text-text-title">
            {PLATFORM_MAP[provider]}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {kpis.map((kpi) => (
            <StatCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              className={innerCardClass}
              compact
              valueClassName="font-heading3"
            />
          ))}
        </div>
      </Card>
    );
  },
);

export default PlatformDetailCard;
