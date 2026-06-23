import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import type { TProviderType } from "@/types/dashboard/overview";
import { PLATFORM_MAP, PROVIDER_TYPES } from "@/types/dashboard/provider";

import Button from "@/components/common/button/Button";
import { DropdownMenu } from "@/components/common/dropdownmenu/DropdownMenu";
import AllPlatformView from "@/components/dashboard/platform/AllPlatformView";
import SinglePlatformView from "@/components/dashboard/platform/SinglePlatformView";

import ChevronDownIcon from "@/assets/icon/chevron/chevron-up.svg?react";

type TPlatformView = "전체" | TProviderType;

type TDashboardHeaderContext = {
  setHeaderRight?: (node: ReactNode | null) => void;
};

export default function PlatformDashboard() {
  const [selectedPlatform, setSelectedPlatform] =
    useState<TPlatformView>("전체");
  const { setHeaderRight } = useOutletContext<TDashboardHeaderContext>();

  const isAllView = selectedPlatform === "전체";

  const platformItems = useMemo(
    () =>
      PROVIDER_TYPES.map((value) => ({
        label: PLATFORM_MAP[value],
        onClick: () => setSelectedPlatform(value),
      })),
    [],
  );

  const selectedPlatformLabel =
    selectedPlatform === "전체"
      ? "플랫폼 선택"
      : PLATFORM_MAP[selectedPlatform];

  useEffect(() => {
    if (!setHeaderRight) return;

    setHeaderRight(
      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="small"
          variant={isAllView ? "primary" : "custom"}
          onClick={() => setSelectedPlatform("전체")}
          className={twMerge(
            "w-28 py-5 font-body1 rounded-2xl",
            !isAllView &&
              "border border-surface-400 bg-surface-100 text-text-muted hover:bg-surface-200",
          )}
        >
          전체보기
        </Button>
        <DropdownMenu
          menuClassName="w-34"
          trigger={
            <Button
              type="button"
              size="small"
              variant={!isAllView ? "primary" : "custom"}
              className={twMerge(
                "flex items-center w-34 py-5 rounded-2xl",
                isAllView &&
                  "border border-surface-400 bg-surface-100 text-text-muted hover:bg-surface-200",
              )}
            >
              <span
                className={twMerge(
                  "font-body1",
                  isAllView ? "text-text-muted" : "text-surface-100",
                )}
              >
                {selectedPlatformLabel}
              </span>
              <ChevronDownIcon
                className={twMerge(
                  "w-3 h-3 rotate-180 ml-2 transition-transform",
                  isAllView ? "text-text-muted" : "text-surface-100",
                )}
              />
            </Button>
          }
          items={platformItems}
        />
      </div>,
    );

    return () => setHeaderRight(null);
  }, [isAllView, platformItems, selectedPlatformLabel, setHeaderRight]);

  return (
    <section className="flex w-full min-w-0 flex-col gap-8">
      {isAllView ? (
        <AllPlatformView />
      ) : (
        <SinglePlatformView platform={selectedPlatform} />
      )}
    </section>
  );
}
