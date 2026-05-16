import { type ReactNode, useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { twMerge } from "tailwind-merge";

import type { IAiReportResponse } from "@/types/dashboard/overview";

import Card from "@/components/common/card/Card";

import { aiReportMockData } from "./aiReport.mock";

import SparkleIcon from "@/assets/icon/ai/sparkle.svg?react";
import ChevronUpIcon from "@/assets/icon/chevron/chevron-up.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

function splitParagraphs(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function ReportParagraphs({
  content,
  compact = false,
}: {
  content: string;
  compact?: boolean;
}) {
  const paragraphs = splitParagraphs(content);

  return (
    <div className={compact ? "flex flex-col gap-1.5" : "flex flex-col gap-2"}>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={twMerge(
            "break-keep text-text-body",
            compact
              ? "font-caption leading-relaxed"
              : "font-body2 leading-relaxed",
          )}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function AiSummaryHighlightSection({
  id,
  title,
  tone,
  icon,
  content,
  className,
}: {
  id: string;
  title: string;
  tone: "primary" | "danger";
  icon: ReactNode;
  content: string;
  className?: string;
}) {
  const isPrimary = tone === "primary";

  return (
    <section
      aria-labelledby={id}
      className={twMerge("rounded-xl border p-4 text-left", className)}
    >
      <div className="flex items-start gap-2">
        <span className="flex w-4.5 shrink-0 justify-center pt-0.5" aria-hidden>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h5
            id={id}
            className={twMerge(
              "mb-2.5 font-heading4",
              isPrimary ? "text-primary-500" : "text-info-red",
            )}
          >
            {title}
          </h5>
          <ReportParagraphs content={content} />
        </div>
      </div>
    </section>
  );
}

function AiReportBody({ data }: { data: IAiReportResponse }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <AiSummaryHighlightSection
          id="ai-summary-strategy"
          title={data.strategySuggestion.title}
          tone="primary"
          content={data.strategySuggestion.content}
          className="border-primary-500/15 bg-primary-500/6"
          icon={
            <SparkleIcon className="h-4.5 w-4.5 fill-current text-primary-500" />
          }
        />

        <AiSummaryHighlightSection
          id="ai-summary-warning"
          title={data.warning.title}
          tone="danger"
          content={data.warning.content}
          className="border-info-red/20 bg-info-red/6"
          icon={<WarnCircleIcon className="h-4.5 w-4.5 text-info-red" />}
        />
      </div>

      <section
        aria-labelledby="ai-summary-insights-heading"
        className="text-left"
      >
        <h5
          id="ai-summary-insights-heading"
          className="mb-2.5 font-caption uppercase tracking-wide text-text-placeholder"
        >
          분석 인사이트
        </h5>
        <ul className="grid list-none grid-cols-3 gap-3 p-0">
          {data.sections.map((section, index) => (
            <li
              key={section.title}
              className="min-w-0 rounded-xl border border-surface-400/25 bg-surface-100/80 p-3.5"
            >
              <div className="flex items-start gap-2">
                <span
                  className="flex w-4.5 shrink-0 justify-center pt-0.5"
                  aria-hidden
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-surface-200 font-caption tabular-nums text-text-muted">
                    {index + 1}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <h6 className="mb-2.5 font-label text-text-title">
                    {section.title}
                  </h6>
                  <ReportParagraphs content={section.content} compact />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

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

  const handleOpen = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleCollapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const handleToggle = useCallback(() => {
    if (isExpanded) handleCollapse();
    else handleOpen();
  }, [handleCollapse, handleOpen, isExpanded]);

  const panelTransition = prefersReducedMotion
    ? { duration: 0 }
    : panelExpandTransition;

  const panelExitTransition = prefersReducedMotion
    ? { duration: 0 }
    : panelCollapseTransition;

  return (
    <div className="w-full min-w-0 shrink-0 scroll-mt-20">
      <Card
        className="w-full min-w-0 shrink-0"
        title="오늘의 성과 AI 요약"
        description={
          <span
            className={twMerge(
              "block text-text-placeholder transition-opacity duration-300",
              isExpanded && "pointer-events-none opacity-0",
            )}
            aria-hidden={isExpanded}
          >
            {AI_SUMMARY_COLLAPSED_HINT}
          </span>
        }
        RightElement={
          <AiSummaryExpandToggle
            isExpanded={isExpanded}
            onToggle={handleToggle}
          />
        }
      >
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
              <AiReportBody data={aiReportMockData} />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
