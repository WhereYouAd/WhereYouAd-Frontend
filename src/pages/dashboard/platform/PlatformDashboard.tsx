import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import Button from "@/components/common/button/Button";
import { DropdownMenu } from "@/components/common/dropdownmenu/DropdownMenu";
import AllPlatformView from "@/components/dashboard/platform/AllPlatformView";
import SinglePlatformView from "@/components/dashboard/platform/SinglePlatformView";

import ChevronDownIcon from "@/assets/icon/chevron/chevron-up.svg?react";

type TDashboardHeaderContext = {
  setHeaderRight?: (node: ReactNode | null) => void;
};

export default function PlatformDashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState("전체");
  const [isLoading, setIsLoading] = useState(true);
  const { setHeaderRight } = useOutletContext<TDashboardHeaderContext>();

  const isAllView = selectedPlatform === "전체";

  const platformItems = useMemo(
    () => [
      { label: "Google", onClick: () => setSelectedPlatform("Google") },
      { label: "NAVER", onClick: () => setSelectedPlatform("NAVER") },
      { label: "Meta", onClick: () => setSelectedPlatform("Meta") },
    ],
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

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
            "w-28 py-5 font-body1 rounded-component-md",
            !isAllView &&
              "border border-bg-disabled bg-white text-text-sub hover:bg-bg-surface",
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
                "flex items-center w-34 py-5 rounded-component-md",
                isAllView &&
                  "border border-bg-disabled bg-white text-text-sub hover:bg-bg-surface",
              )}
            >
              <span
                className={twMerge(
                  "font-body1",
                  isAllView ? "text-text-sub" : "text-white",
                )}
              >
                {isAllView ? "플랫폼 선택" : selectedPlatform}
              </span>
              <ChevronDownIcon
                className={twMerge(
                  "w-3 h-3 rotate-180 ml-2 transition-transform",
                  isAllView ? "text-text-sub" : "text-white",
                )}
              />
            </Button>
          }
          items={platformItems}
        />
      </div>,
    );

    return () => setHeaderRight(null);
  }, [isAllView, platformItems, selectedPlatform, setHeaderRight]);

  return (
    <section className="flex flex-col gap-8 w-full min-w-0">
      {isAllView ? (
        <AllPlatformView isLoading={isLoading} />
      ) : (
        <SinglePlatformView platform={selectedPlatform} isLoading={isLoading} />
      )}
    </section>
  );
}
