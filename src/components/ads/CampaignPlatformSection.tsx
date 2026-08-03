import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import type { IPlatformProjectBudget, TPlatform } from "@/types/ads/campaign";

import { mapPlatformProjectBudgetToGauges } from "@/utils/ads/projectBudget";

import BudgetGaugeChart from "@/components/dashboard/charts/BudgetGaugeChart";

import GoogleLogo from "@/assets/logo/social-logo/circle/google-circle.svg?react";
import MetaLogo from "@/assets/logo/social-logo/circle/meta-circle.svg?react";
import NaverLogo from "@/assets/logo/social-logo/circle/naver-circle.svg?react";

const PLATFORM_LOGO: Record<TPlatform, ReactNode> = {
  google: <GoogleLogo className="h-10 w-10 shrink-0" />,
  meta: <MetaLogo className="h-10 w-10 shrink-0 text-text-title" />,
  naver: <NaverLogo className="h-10 w-10 shrink-0" />,
};

const PLATFORM_LABEL: Record<TPlatform, string> = {
  google: "Google",
  meta: "Meta",
  naver: "NAVER",
};

const gaugeGridClass =
  "grid grid-cols-2 items-stretch gap-x-8 gap-y-4 tablet:grid-cols-1 tablet:gap-x-0";

const gaugeBoxClass =
  "flex h-full min-h-36 flex-col rounded-2xl border border-surface-400/40 bg-surface-100 px-5 py-5";

interface ICampaignPlatformSectionProps {
  platform: TPlatform;
  platformBudget?: IPlatformProjectBudget;
}

export default function CampaignPlatformSection({
  platform,
  platformBudget,
}: ICampaignPlatformSectionProps) {
  const gauges = platformBudget
    ? mapPlatformProjectBudgetToGauges(platformBudget)
    : [];

  return (
    <section className="flex flex-col gap-5">
      <header className="flex min-w-0 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-3">
          {PLATFORM_LOGO[platform]}
          <div className="flex min-w-0 flex-col gap-1.5">
            <h2 className="font-heading3 text-text-title">
              {PLATFORM_LABEL[platform]}
            </h2>
            {platformBudget?.adCampaignName ? (
              <p className="truncate font-caption text-text-muted">
                {platformBudget.adCampaignName}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      {gauges.length === 0 ? (
        <p className="py-6 text-center font-body2 text-text-placeholder">
          예산 정보가 없습니다.
        </p>
      ) : (
        <div className={gaugeGridClass}>
          {gauges.map((gauge) => (
            <div
              key={`${platform}-${gauge.label}`}
              className={twMerge(gaugeBoxClass, "min-w-0")}
            >
              <BudgetGaugeChart
                {...gauge}
                compact
                tightHeader
                showInsight={false}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
