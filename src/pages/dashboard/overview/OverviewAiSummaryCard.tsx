import { type ReactNode, useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { twMerge } from "tailwind-merge";

import type { IAiReportResponse } from "@/types/dashboard/overview";

import Card from "@/components/common/card/Card";

import { aiReportMockData } from "./aiReport.mock";

import SparkleIcon from "@/assets/icon/ai/sparkle.svg?react";
import ChevronUpIcon from "@/assets/icon/chevron/chevron-up.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

/** 더 보기 접힘 시 기본 노출 문단 수 */
const COLLAPSED_PREVIEW_PARAGRAPHS = 2;

/** 줄바꿈 기준 본문 문단 분리 */
function splitParagraphs(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** 리포트 본문 문단 렌더 */
function ReportParagraphs({
  paragraphs,
  className,
}: {
  paragraphs: string[];
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={twMerge(
            "break-keep leading-relaxed text-text-body",
            className,
          )}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

/** 긴 본문은 일부만 보여 주고 더 보기/접기 */
function CollapsibleReportContent({
  content,
  previewParagraphs = COLLAPSED_PREVIEW_PARAGRAPHS,
  paragraphClassName,
}: {
  content: string;
  previewParagraphs?: number;
  paragraphClassName?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const paragraphs = splitParagraphs(content);
  const hasMore = paragraphs.length > previewParagraphs;
  const visibleParagraphs =
    hasMore && !isExpanded
      ? paragraphs.slice(0, previewParagraphs)
      : paragraphs;

  return (
    <div>
      <ReportParagraphs
        paragraphs={visibleParagraphs}
        className={paragraphClassName}
      />
      {hasMore && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-2 font-caption text-primary-500 transition-colors hover:text-primary-400"
          aria-expanded={isExpanded}
        >
          {isExpanded ? "접기" : "더 보기"}
        </button>
      )}
    </div>
  );
}

/** 전략 제안·주의 블록 (아이콘 + 제목 + 본문) */
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
      className={twMerge("rounded-xl p-4 text-left", className)}
    >
      <div className="flex h-full items-start gap-2">
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
          <CollapsibleReportContent
            content={content}
            paragraphClassName="font-body2"
          />
        </div>
      </div>
    </section>
  );
}

/** 펼침 패널 본문: 상단 2열 + 하단 인사이트 */
function AiReportBody({ data }: { data: IAiReportResponse }) {
  return (
    <div className="flex flex-col gap-5">
      {/* 전략 제안 · 주의가 필요한 부분 */}
      <div className="grid grid-cols-2 gap-3 tablet:grid-cols-1">
        <AiSummaryHighlightSection
          id="ai-summary-strategy"
          title={data.strategySuggestion.title}
          tone="primary"
          content={data.strategySuggestion.content}
          className="bg-primary-500/6"
          icon={
            <SparkleIcon className="h-4.5 w-4.5 fill-current text-primary-500" />
          }
        />

        <AiSummaryHighlightSection
          id="ai-summary-warning"
          title={data.warning.title}
          tone="danger"
          content={data.warning.content}
          className="bg-info-red/6"
          icon={<WarnCircleIcon className="h-4.5 w-4.5 text-info-red" />}
        />
      </div>

      {/* 분석 인사이트 3열 (tablet 이하 1열) */}
      <section
        aria-labelledby="ai-summary-insights-heading"
        className="rounded-xl bg-primary-500/4 p-6 text-left"
      >
        <h5
          id="ai-summary-insights-heading"
          className="mb-3 font-body2 uppercase tracking-wide text-text-placeholder"
        >
          분석 인사이트
        </h5>
        <ul className="grid list-none grid-cols-3 gap-4 p-0 tablet:grid-cols-1">
          {data.sections.map((section, index) => (
            <li key={section.title} className="min-w-0">
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
                  <h6 className="mb-2 font-label text-text-title">
                    {section.title}
                  </h6>
                  <CollapsibleReportContent
                    content={section.content}
                    previewParagraphs={3}
                    paragraphClassName="font-body2"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/** 카드 우측 펼치기/접기 버튼 */
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

/** 접힌 상태 안내 문구 */
const AI_SUMMARY_COLLAPSED_HINT =
  "펼치기를 누르면 오늘 광고 성과를 AI가 분석·요약해 드려요.";

/** 패널 펼침 애니메이션 */
const panelExpandTransition = {
  height: { duration: 0.72, ease: [0.33, 1, 0.68, 1] as const },
  opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const, delay: 0.06 },
};

/** 패널 접힘 애니메이션 */
const panelCollapseTransition = {
  height: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  opacity: { duration: 0.28, ease: [0.4, 0, 1, 1] as const },
};

/** 통합 대시보드 AI 요약 카드 (mock 데이터, 드로어와 분리) */
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
      <Card className="w-full min-w-0 shrink-0 border border-primary-500/15">
        {/* 헤더: 제목 · 접힌 안내 · 펼치기 */}
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

        {/* 펼침 시 리포트 본문 (height 애니메이션) */}
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
                <AiReportBody data={aiReportMockData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
