import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { twMerge } from "tailwind-merge";

import type { IAnalysisResponse } from "@/types/dashboard/aiAnalysis";

import Card from "@/components/common/card/Card";
import { Skeleton } from "@/components/common/skeleton/Skeleton";

import { downloadAiSummaryPdf } from "../print/downloadAiSummaryPdf";
import {
  formatNumberedList,
  splitParagraphs,
  type TAiReportPrintOptions,
  toAiReportPrintDocument,
} from "../utils/aiReport.utils";

import SparkleIcon from "@/assets/icon/ai/sparkle.svg?react";
import ChevronUpIcon from "@/assets/icon/chevron/chevron-up.svg?react";
import DownloadIcon from "@/assets/icon/common/download.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

const DEFAULT_CARD_TITLE = "광고 성과 AI 요약";
const DEFAULT_COLLAPSED_HINT =
  "펼치기를 누르면 선택 기간의 광고 성과를 AI가 분석·요약해 드려요.";

const aiSummaryActionButtonClass =
  "group inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full border-none bg-surface-200/60 px-4 font-body3 text-text-muted transition-colors hover:bg-surface-200 hover:text-text-body";

export type TAiSummaryCardProps = {
  data?: IAnalysisResponse;
  isLoading?: boolean;
  loadingMessage?: string | null;
  isError?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  /** 접힌 상태에서 펼칠 때 (분석 요청 등) */
  onExpand?: () => void;
  /** 카드 헤더 제목 */
  title?: string;
  /** 접힌 상태 안내 문구 */
  collapsedHint?: string;
  /** 데이터 없을 때 접힌 안내 */
  emptyHint?: string;
  idPrefix?: string;
  /** PDF·인쇄 메타 */
  print?: TAiReportPrintOptions;
  /** 분석 기간 표시 (예: 분석 기준 2026.02.22 ~ 2026.03.22) */
  periodLabel?: string;
  className?: string;
};

function ReportParagraphs({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="break-keep font-body3 text-text-body">
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
          <ReportParagraphs paragraphs={splitParagraphs(content)} />
        </div>
      </div>
    </section>
  );
}

const INSIGHT_ITEMS = [
  {
    title: "성과 요약",
    content: (data: IAnalysisResponse) => data.performanceSummary,
  },
  {
    title: "왜 이렇게 나왔을까?",
    content: (data: IAnalysisResponse) => data.analysisReason,
  },
  {
    title: "성과 포인트",
    content: (data: IAnalysisResponse) =>
      formatNumberedList(data.performancePoint),
  },
] as const;

function AiReportBody({
  data,
  idPrefix,
}: {
  data: IAnalysisResponse;
  idPrefix: string;
}) {
  const cautionList = formatNumberedList(data.cautionPoint);
  const cautionContent =
    cautionList === "—" ? "특별히 주의가 필요한 항목이 없습니다." : cautionList;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 tablet:grid-cols-1">
        <AiSummaryHighlightSection
          id={`${idPrefix}-strategy`}
          title="전략 제안"
          tone="primary"
          content={data.strategySuggestion}
          className="bg-primary-500/6"
          icon={
            <SparkleIcon className="h-4.5 w-4.5 fill-current text-primary-500" />
          }
        />

        <AiSummaryHighlightSection
          id={`${idPrefix}-warning`}
          title="주의가 필요한 부분"
          tone="danger"
          content={cautionContent}
          className="bg-info-red/6"
          icon={<WarnCircleIcon className="h-4.5 w-4.5 text-info-red" />}
        />
      </div>

      <section
        aria-labelledby={`${idPrefix}-insights-heading`}
        className="rounded-xl bg-primary-500/4 p-6 text-left"
      >
        <h5
          id={`${idPrefix}-insights-heading`}
          className="mb-3 font-heading4 uppercase tracking-wide text-text-placeholder"
        >
          분석 인사이트
        </h5>
        <ul className="grid list-none grid-cols-3 gap-4 p-0 tablet:grid-cols-1">
          {INSIGHT_ITEMS.map((item, index) => (
            <li key={item.title} className="min-w-0">
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
                  <h6 className="mb-2 font-heading4 text-text-title">
                    {item.title}
                  </h6>
                  <ReportParagraphs
                    paragraphs={splitParagraphs(item.content(data))}
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

function AiSummaryExpandToggle({
  cardTitle,
  isExpanded,
  onToggle,
}: {
  cardTitle: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={aiSummaryActionButtonClass}
      aria-expanded={isExpanded}
      aria-label={isExpanded ? `${cardTitle} 접기` : `${cardTitle} 펼치기`}
    >
      <span>{isExpanded ? "접기" : "펼치기"}</span>
      <ChevronUpIcon
        className={twMerge(
          "h-4 w-4 shrink-0 text-current transition-transform duration-300",
          !isExpanded && "rotate-180",
        )}
        aria-hidden
      />
    </button>
  );
}

const panelExpandTransition = {
  height: { duration: 0.72, ease: [0.33, 1, 0.68, 1] as const },
  opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const, delay: 0.06 },
};

const panelCollapseTransition = {
  height: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  opacity: { duration: 0.28, ease: [0.4, 0, 1, 1] as const },
};

function AiSummaryCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-4"
      aria-busy="true"
      aria-label="AI 요약 로딩"
    >
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-3 tablet:grid-cols-1">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}

export default function AiSummaryCard({
  data,
  isLoading = false,
  loadingMessage,
  isError = false,
  errorMessage,
  onRetry,
  onExpand,
  title = DEFAULT_CARD_TITLE,
  collapsedHint = DEFAULT_COLLAPSED_HINT,
  emptyHint = DEFAULT_COLLAPSED_HINT,
  idPrefix = "ai-summary",
  print,
  periodLabel,
  className,
}: TAiSummaryCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const autoExpandOnResultRef = useRef(false);

  useEffect(() => {
    if (data && autoExpandOnResultRef.current) {
      setIsExpanded(true);
      autoExpandOnResultRef.current = false;
    }
    if (!data && !isLoading) {
      autoExpandOnResultRef.current = false;
    }
  }, [data, isLoading]);

  const printDocument = useMemo(
    () => (data ? toAiReportPrintDocument(data, print) : null),
    [data, print],
  );

  const handleToggle = useCallback(() => {
    const next = !isExpanded;
    setIsExpanded(next);
    if (next) {
      onExpand?.();
      if (!data) autoExpandOnResultRef.current = true;
    } else if (isLoading) {
      autoExpandOnResultRef.current = false;
    }
  }, [isExpanded, data, isLoading, onExpand]);

  const handleDownloadPdf = useCallback(() => {
    if (!printDocument) return;
    downloadAiSummaryPdf(printDocument);
  }, [printDocument]);

  const collapsedMessage = useMemo(() => {
    if (isLoading) {
      return (
        loadingMessage ??
        "AI가 광고 성과를 분석하고 있어요. 보통 10~30초 걸려요."
      );
    }
    if (isError && errorMessage) return errorMessage;
    if (!data) return emptyHint;
    return collapsedHint;
  }, [
    collapsedHint,
    data,
    emptyHint,
    errorMessage,
    isError,
    isLoading,
    loadingMessage,
  ]);

  const panelTransition = prefersReducedMotion
    ? { duration: 0 }
    : panelExpandTransition;

  const panelExitTransition = prefersReducedMotion
    ? { duration: 0 }
    : panelCollapseTransition;

  return (
    <div className={twMerge("w-full min-w-0 shrink-0 scroll-mt-20", className)}>
      <Card className="w-full min-w-0 shrink-0 border border-primary-500/15">
        <div className="relative mb-4 flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="flex min-w-0 flex-wrap items-center gap-2 font-heading4">
              <SparkleIcon
                className="h-5 w-5 shrink-0 fill-primary-400 text-primary-400"
                aria-hidden
              />
              <span className="bg-linear-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                {title}
              </span>
              <span className="shrink-0 rounded-full bg-primary-500/12 px-2 py-0.5 font-caption text-primary-500">
                AI
              </span>
            </h3>
            {periodLabel ? (
              <p className="font-caption text-text-placeholder">
                {periodLabel}
              </p>
            ) : null}
            {!isExpanded && (
              <p
                className={twMerge(
                  "font-caption",
                  isError ? "text-info-red" : "text-text-placeholder",
                )}
              >
                {collapsedMessage}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {isError && onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className={aiSummaryActionButtonClass}
              >
                다시 시도
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={!printDocument || isLoading}
              className={twMerge(
                aiSummaryActionButtonClass,
                (!printDocument || isLoading) &&
                  "pointer-events-none opacity-50",
              )}
              aria-label={`${title} PDF 저장`}
            >
              <DownloadIcon
                className="h-4 w-4 shrink-0 text-current"
                aria-hidden
              />
              <span>PDF 저장</span>
            </button>
            <AiSummaryExpandToggle
              cardTitle={title}
              isExpanded={isExpanded}
              onToggle={handleToggle}
            />
          </div>
        </div>

        <div className="relative">
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key={`${idPrefix}-panel`}
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
                {isLoading ? (
                  <div className="flex flex-col gap-4">
                    {loadingMessage ? (
                      <p className="text-center font-body3 text-text-muted">
                        {loadingMessage}
                      </p>
                    ) : null}
                    <AiSummaryCardSkeleton />
                  </div>
                ) : isError && errorMessage ? (
                  <p className="py-6 text-center font-body3 text-info-red">
                    {errorMessage}
                  </p>
                ) : data ? (
                  <AiReportBody data={data} idPrefix={idPrefix} />
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
