import { twMerge } from "tailwind-merge";

import Button from "@/components/common/button/Button";
import { DropdownMenu } from "@/components/common/dropdownmenu/DropdownMenu";

import ChevronDownIcon from "@/assets/icon/chevron/chevron-up.svg?react";

type TPlatformViewSwitcherItem = {
  label: string;
  onClick: () => void;
};

interface IPlatformViewSwitcherProps {
  isAllView: boolean;
  selectedPlatformLabel: string;
  platformItems: TPlatformViewSwitcherItem[];
  onSelectAll: () => void;
  layout?: "header" | "mobile";
  className?: string;
  isPlatformSelectDisabled?: boolean;
}

export default function PlatformViewSwitcher({
  isAllView,
  selectedPlatformLabel,
  platformItems,
  onSelectAll,
  layout = "header",
  className,
  isPlatformSelectDisabled = false,
}: IPlatformViewSwitcherProps) {
  const isMobileLayout = layout === "mobile";

  const platformTriggerClassName = twMerge(
    "flex h-12 items-center rounded-2xl",
    isMobileLayout ? "w-full min-w-0" : "w-34 shrink-0",
    isAllView &&
      "border border-surface-400 bg-surface-100 text-text-muted hover:bg-surface-200",
    isPlatformSelectDisabled &&
      "cursor-not-allowed border border-surface-400 bg-surface-200 text-text-muted hover:bg-surface-200",
  );

  return (
    <div
      className={twMerge(
        isMobileLayout
          ? "hidden w-full min-w-0 grid-cols-2 gap-2 mobile:grid"
          : "flex items-center gap-2",
        className,
      )}
    >
      <Button
        type="button"
        size="small"
        variant={isAllView ? "primary" : "custom"}
        onClick={onSelectAll}
        className={twMerge(
          "h-12 rounded-2xl font-body1",
          isMobileLayout ? "w-full min-w-0" : "w-28 shrink-0",
          !isAllView &&
            "border border-surface-400 bg-surface-100 text-text-muted hover:bg-surface-200",
        )}
      >
        전체보기
      </Button>
      <div className={isMobileLayout ? "min-w-0" : undefined}>
        {isPlatformSelectDisabled ? (
          <Button
            type="button"
            size="small"
            variant="custom"
            disabled
            aria-disabled="true"
            className={platformTriggerClassName}
          >
            <span className="truncate font-body1 text-text-muted">
              {selectedPlatformLabel}
            </span>
            <ChevronDownIcon className="ml-2 h-3 w-3 shrink-0 rotate-180 text-text-muted" />
          </Button>
        ) : (
          <DropdownMenu
            fullWidth={isMobileLayout}
            menuClassName={twMerge("w-34", isMobileLayout && "w-full")}
            aria-label="플랫폼 선택"
            trigger={
              <Button
                type="button"
                size="small"
                variant={!isAllView ? "primary" : "custom"}
                className={platformTriggerClassName}
              >
                <span
                  className={twMerge(
                    "truncate font-body1",
                    isAllView ? "text-text-muted" : "text-surface-100",
                  )}
                >
                  {selectedPlatformLabel}
                </span>
                <ChevronDownIcon
                  className={twMerge(
                    "ml-2 h-3 w-3 shrink-0 rotate-180 transition-transform",
                    isAllView ? "text-text-muted" : "text-surface-100",
                  )}
                />
              </Button>
            }
            items={platformItems}
          />
        )}
      </div>
    </div>
  );
}
