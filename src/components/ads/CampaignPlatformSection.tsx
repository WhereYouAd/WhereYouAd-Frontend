import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import type { IPlatformProjectBudget, TPlatform } from "@/types/ads/campaign";

import {
  BUDGET_EDIT_BLOCK_MESSAGES,
  canSubmitPlatformBudgetEdit,
} from "@/utils/ads/budgetEdit";
import { mapPlatformProjectBudgetToGauges } from "@/utils/ads/projectBudget";

import PlatformBudgetItem from "@/components/ads/PlatformBudgetItem";
import Button from "@/components/common/button/Button";

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

interface ICampaignPlatformSectionProps {
  platform: TPlatform;
  platformBudget?: IPlatformProjectBudget;
  onEditBudget?: () => void;
}

export default function CampaignPlatformSection({
  platform,
  platformBudget,
  onEditBudget,
}: ICampaignPlatformSectionProps) {
  const gauges = platformBudget
    ? mapPlatformProjectBudgetToGauges(platformBudget)
    : [];

  const editCheck = canSubmitPlatformBudgetEdit(platformBudget);
  const isBudgetEditDisabled = !onEditBudget || !editCheck.ok;
  const budgetEditDisabledReason = !onEditBudget
    ? undefined
    : editCheck.ok
      ? undefined
      : BUDGET_EDIT_BLOCK_MESSAGES[editCheck.reason];
  const budgetEditHintId = `budget-edit-hint-${platform}`;

  const budgetEditAction = (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        size="small"
        variant="outline"
        className={twMerge(
          "h-9 shrink-0 px-3.5",
          isBudgetEditDisabled && "opacity-60",
        )}
        onClick={onEditBudget}
        disabled={isBudgetEditDisabled}
        aria-describedby={
          budgetEditDisabledReason ? budgetEditHintId : undefined
        }
      >
        예산 수정
      </Button>
      {budgetEditDisabledReason ? (
        <p
          id={budgetEditHintId}
          className="max-w-48 text-right font-caption text-text-muted"
        >
          {budgetEditDisabledReason}
        </p>
      ) : null}
    </div>
  );

  return (
    <section className="flex flex-col gap-4">
      <header className="border-b border-surface-400/45 pb-4">
        <div className="flex min-w-0 items-stretch gap-3">
          <span
            className="w-1 shrink-0 rounded-r-md bg-surface-400"
            aria-hidden
          />
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {PLATFORM_LOGO[platform]}
            <div className="flex min-w-0 flex-col gap-1">
              <h2 className="text-text-title">
                <span className="font-heading3 mobile:hidden">
                  {PLATFORM_LABEL[platform]}
                </span>
                <span className="hidden font-heading4 mobile:inline">
                  {PLATFORM_LABEL[platform]}
                </span>
              </h2>
              {platformBudget?.adCampaignName ? (
                <p className="truncate font-body2 text-text-muted">
                  {platformBudget.adCampaignName}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {gauges.length === 0 ? (
        <p className="py-4 text-center font-body2 text-text-placeholder">
          예산 정보가 없습니다.
        </p>
      ) : (
        <div className="w-full min-w-0">
          {gauges.map((gauge) => (
            <PlatformBudgetItem
              key={`${platform}-${gauge.label}`}
              {...gauge}
              headerAction={budgetEditAction}
            />
          ))}
        </div>
      )}
    </section>
  );
}
