import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/components/common/button/Button";
import { DropdownMenu } from "@/components/common/dropdownmenu/DropdownMenu";
import PageHeader from "@/components/common/PageHeader";
import AllPlatformView from "@/components/dashboard/platform/AllPlatformView";

import ChevronDownIcon from "@/assets/icon/chevron/chevron-up.svg?react";

export default function PlatformDashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState("전체");
  const [isLoading, setIsLoading] = useState(true);

  const isAllView = selectedPlatform === "전체";

  const platformItems = [
    { label: "Google", onClick: () => setSelectedPlatform("Google") },
    { label: "NAVER", onClick: () => setSelectedPlatform("NAVER") },
    { label: "Meta", onClick: () => setSelectedPlatform("Meta") },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="flex flex-col gap-8 w-full min-w-0">
      <PageHeader
        title="플랫폼 대시보드"
        description="데이터 기준 · 2026. 04. 03. 오전 09:13"
        actions={
          <div className="flex items-center gap-5">
            <Button
              type="button"
              size="small"
              variant={isAllView ? "primary" : "custom"}
              onClick={() => setSelectedPlatform("전체")}
              className={twMerge(
                "w-34 py-6 font-body1 rounded-component-md",
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
                    "flex items-center w-34 py-6 rounded-component-md",
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
          </div>
        }
      />

      {isAllView ? (
        <AllPlatformView isLoading={isLoading} />
      ) : (
        <div className="flex flex-col gap-8">
          <h2>{selectedPlatform}</h2>
        </div>
      )}
    </section>
  );
}
