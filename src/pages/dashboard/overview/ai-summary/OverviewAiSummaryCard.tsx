/** 통합 대시보드 AI 요약 카드 */
import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { twMerge } from "tailwind-merge";

import Card from "@/components/common/card/Card";

import { aiReportMockData } from "./aiReport.mock";
import { AiSummaryReportBody } from "./AiSummaryReportBody";

import SparkleIcon from "@/assets/icon/ai/sparkle.svg?react";
import ChevronUpIcon from "@/assets/icon/chevron/chevron-up.svg?react";

function AiSummaryExpandToggle({
  isExpanded,
  onToggle,
}: {
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="group flex h-8 min-w-18 shrink-0 items-center justify-center gap-1 rounded-full border-none bg-surface-200/60 px-3 text-text-muted transition-colors hover:bg-surface-200 hover:text-text-body"
      aria-expanded={isExpanded}
      aria-label={
        isExpanded ? "오늘의 성과 AI 요약 접기" : "오늘의 성과 AI 요약 펼치기"
      }
    >
      <span className="font-caption">{isExpanded ? "접기" : "펼치기"}</span>
      <ChevronUpIcon
        className={twMerge(
          "h-4 w-4 shrink-0 transition-transform duration-300",
          !isExpanded && "rotate-180",
        )}
        aria-hidden
      />
    </button>
  );
}

const AI_SUMMARY_COLLAPSED_HINT =
  "펼치기를 누르면 오늘 광고 성과를 AI가 분석·요약해 드려요.";

const panelExpandTransition = {
  height: { duration: 0.72, ease: [0.33, 1, 0.68, 1] as const },
  opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const, delay: 0.06 },
};

const panelCollapseTransition = {
  height: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  opacity: { duration: 0.28, ease: [0.4, 0, 1, 1] as const },
};

export default function OverviewAiSummaryCard() {
  const prefersReducedMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const panelTransition = prefersReducedMotion
    ? { duration: 0 }
    : panelExpandTransition;

  const panelExitTransition = prefersReducedMotion
    ? { duration: 0 }
    : panelCollapseTransition;

  return (
    <div className="w-full min-w-0 shrink-0 scroll-mt-20">
      <Card className="w-full min-w-0 shrink-0 border border-primary-500/15">
        <div className="relative mb-4 flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="flex min-w-0 flex-wrap items-center gap-2 font-heading4">
              <SparkleIcon
                className="h-5 w-5 shrink-0 fill-primary-400 text-primary-400"
                aria-hidden
              />
              <span className="bg-linear-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                오늘의 성과 AI 요약
              </span>
              <span className="shrink-0 rounded-full bg-primary-500/12 px-2 py-0.5 font-caption text-primary-500">
                AI
              </span>
            </h3>
            {!isExpanded && (
              <p className="font-caption text-text-placeholder">
                {AI_SUMMARY_COLLAPSED_HINT}
              </p>
            )}
          </div>
          <AiSummaryExpandToggle
            isExpanded={isExpanded}
            onToggle={handleToggle}
          />
        </div>

        <div className="relative">
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="ai-summary-panel"
                layout
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, height: "auto" }
                    : { opacity: 0, height: 0 }
                }
                animate={{ opacity: 1, height: "auto" }}
                exit={{
                  opacity: 0,
                  height: 0,
                  transition: panelExitTransition,
                }}
                transition={panelTransition}
                className="overflow-hidden"
              >
                <AiSummaryReportBody data={aiReportMockData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
