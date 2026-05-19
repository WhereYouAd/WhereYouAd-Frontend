/** 카드 펼침 시 보이는 AI 리포트 본문 (전략·주의·인사이트) */
import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import type { IAiReportResponse } from "@/types/dashboard/overview";

import SparkleIcon from "@/assets/icon/ai/sparkle.svg?react";
import WarnCircleIcon from "@/assets/icon/common/warn-circle.svg?react";

function splitParagraphs(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

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
          <ReportParagraphs
            paragraphs={splitParagraphs(content)}
            className="font-body2"
          />
        </div>
      </div>
    </section>
  );
}

export function AiSummaryReportBody({ data }: { data: IAiReportResponse }) {
  return (
    <div className="flex flex-col gap-5">
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
                  <ReportParagraphs
                    paragraphs={splitParagraphs(section.content)}
                    className="font-body2"
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
