import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { printAsPdf } from "@/utils/download";

import Button from "@/components/common/button/Button";
import { DropdownMenu } from "@/components/common/dropdownmenu/DropdownMenu";
import AllPlatformView from "@/components/dashboard/platform/AllPlatformView";
import SinglePlatformView from "@/components/dashboard/platform/SinglePlatformView";

import { OverviewAiDrawer } from "../overview/OverviewAiDrawer";

import SparkleCircleIcon from "@/assets/icon/ai/sparkle-circle.svg?react";
import ChevronDownIcon from "@/assets/icon/chevron/chevron-up.svg?react";
import AiButtonSvg from "@/assets/logo/service-logo/ai-요약버튼.svg?react";

type TDashboardHeaderContext = {
  setHeaderRight?: (node: ReactNode | null) => void;
};

export default function PlatformDashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState("전체");
  const [isLoading, setIsLoading] = useState(true);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
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

        <button
          type="button"
          onClick={() => setIsAiPanelOpen(true)}
          className="group relative ml-4 -mr-2 inline-flex h-8 cursor-pointer items-center justify-center overflow-hidden rounded-2xl px-1 outline-none focus-visible:ring-2 focus-visible:ring-logo-2/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label="AI 요약하기"
        >
          <div className="pointer-events-none absolute inset-0 z-20 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-white/80 to-transparent mix-blend-overlay group-hover:animate-[shimmer_1.2s_ease-out]" />
          <div className="relative z-10">
            <span className="sm:hidden">
              <SparkleCircleIcon className="h-5 w-5 fill-current text-logo-1" />
            </span>
            <span className="hidden sm:block">
              <AiButtonSvg className="h-6 w-auto [&>path:nth-of-type(4)]:transition-transform [&>path:nth-of-type(4)]:duration-300 group-hover:[&>path:nth-of-type(4)]:translate-x-0.5 [&>path:nth-of-type(5)]:transition-transform [&>path:nth-of-type(5)]:duration-300 group-hover:[&>path:nth-of-type(5)]:translate-x-1" />
            </span>
          </div>
        </button>
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

      {/* AI 요약 패널 */}
      <OverviewAiDrawer
        isOpen={isAiPanelOpen}
        onClose={() => setIsAiPanelOpen(false)}
        onShareLink={() => {
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => toast.success("링크가 복사되었습니다."))
            .catch(() => toast.error("링크 복사에 실패했습니다."));
        }}
        onDownloadPdf={() => printAsPdf("ai-report-printing")}
      />
    </section>
  );
}
