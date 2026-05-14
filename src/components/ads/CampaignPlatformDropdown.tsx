import { twMerge } from "tailwind-merge";

import type { IPlatformCampaign } from "@/types/ads/campaign";

import {
  DropdownMenu,
  type TMenuItem,
} from "@/components/common/dropdownmenu/DropdownMenu";

import ChevronIcon from "@/assets/icon/chevron/chevron-up.svg?react";

type TProps = {
  options: IPlatformCampaign[];
  selected: IPlatformCampaign | null;
  onSelect: (option: IPlatformCampaign) => void;
  placeholder?: string;
};

export default function CampaignPlatformDropdown({
  options,
  selected,
  onSelect,
  placeholder = "캠페인 선택",
}: TProps) {
  const items: TMenuItem[] = options.map((opt) => ({
    label: opt.name,
    onClick: () => {
      onSelect(opt);
    },
    active: selected !== null && selected.adCampaignId === opt.adCampaignId,
  }));

  const label = selected === null ? placeholder : selected.name;

  return (
    <DropdownMenu
      fullWidth
      aria-label="캠페인 선택"
      items={items}
      trigger={(open) => (
        <div
          tabIndex={0}
          className={twMerge(
            "flex h-14 w-full cursor-pointer items-center justify-between rounded-2xl bg-surface-100 px-5 text-left font-body1 ring-1 ring-surface-400 transition-colors duration-200 ease-out outline-none",
            "hover:bg-surface-200 hover:ring-surface-400",
            "focus-visible:ring-2 focus-visible:ring-surface-400",
            selected === null && "text-text-placeholder",
            selected !== null && "text-text-title",
          )}
        >
          <span className="min-w-0 flex-1 truncate">{label}</span>
          <ChevronIcon
            className={twMerge(
              "h-4 w-4 shrink-0 text-text-muted transition-transform duration-200",
              open ? "rotate-0" : "rotate-180",
            )}
            aria-hidden={true}
          />
        </div>
      )}
    />
  );
}
