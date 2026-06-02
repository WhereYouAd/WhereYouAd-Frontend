import type { ReactNode } from "react";

import Badge from "@/components/common/badge/Badge";
import Button from "@/components/common/button/Button";

import KakaoLogo from "@/assets/logo/social-logo/circle/kakao-circle.svg?react";

const UPCOMING_CARD_SHELL_CLASS =
  "flex h-full min-h-70 w-full rounded-3xl bg-surface-100 p-8 shadow-Soft tablet:p-8";
const UPCOMING_CARD_DISABLED_CLASS =
  "pointer-events-none select-none opacity-70 grayscale";

type TProps = {
  title: string;
  badgeText: string;
  description: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export default function UpcomingPlatformCard({
  title,
  badgeText,
  description,
  icon,
  disabled = true,
}: TProps) {
  return (
    <div
      className={[
        UPCOMING_CARD_SHELL_CLASS,
        "flex-col gap-4",
        disabled && UPCOMING_CARD_DISABLED_CLASS,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-disabled={disabled}
    >
      <div className="flex min-w-0 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0">
            {icon ?? (
              <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-surface-200 font-heading3 text-text-muted">
                ?
              </span>
            )}
          </div>
          <h3 className="min-w-0 truncate font-heading3 text-text-title">
            {title}
          </h3>
        </div>

        <Badge variant="surface" className="h-8 shrink-0 font-body2">
          {badgeText}
        </Badge>
      </div>

      <p className="font-body2 text-text-muted">{description}</p>

      <div className="mt-auto flex w-full">
        <Button type="button" size="big" fullWidth disabled>
          준비 중
        </Button>
      </div>
    </div>
  );
}

export function KakaoUpcomingCard() {
  return (
    <UpcomingPlatformCard
      title="Kakao"
      badgeText="준비 중"
      description="연동을 검토 중이에요."
      icon={<KakaoLogo className="h-12 w-12" />}
    />
  );
}

export function ComingSoonUpcomingCard() {
  return (
    <div
      className={[
        UPCOMING_CARD_SHELL_CLASS,
        "flex",
        UPCOMING_CARD_DISABLED_CLASS,
      ].join(" ")}
      aria-disabled
    >
      <div className="flex flex-1 items-center justify-center">
        <p className="font-heading3 text-text-muted">Coming soon…</p>
      </div>
    </div>
  );
}
