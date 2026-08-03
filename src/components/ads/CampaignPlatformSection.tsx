import type { ReactNode } from "react";

import type { IPlatformProjectBudget, TPlatform } from "@/types/ads/campaign";

import { mapPlatformProjectBudgetToGauges } from "@/utils/ads/projectBudget";

import PlatformBudgetItem from "@/components/ads/PlatformBudgetItem";

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

const budgetGridClass =
  "grid grid-cols-2 items-start gap-x-8 gap-y-3 tablet:grid-cols-1 tablet:gap-x-0";

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
    <section className="flex flex-col gap-4">
      <header className="flex min-w-0 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-3">
          {PLATFORM_LOGO[platform]}
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="font-heading3 text-text-title">
              {PLATFORM_LABEL[platform]}
            </h2>
            {platformBudget?.adCampaignName ? (
              <p className="truncate font-body2 text-text-muted">
                {platformBudget.adCampaignName}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      {gauges.length === 0 ? (
        <p className="py-4 text-center font-body2 text-text-placeholder">
          예산 정보가 없습니다.
        </p>
      ) : (
        <div className={budgetGridClass}>
          {gauges.map((gauge) => (
            <PlatformBudgetItem key={`${platform}-${gauge.label}`} {...gauge} />
          ))}
        </div>
      )}
    </section>
  );
}
