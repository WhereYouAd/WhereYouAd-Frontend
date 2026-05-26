import type {
  IAnalysisResponse,
  TAiAnalysisProvider,
} from "@/types/dashboard/aiAnalysis";
import { PLATFORM_MAP } from "@/types/dashboard/platform";

import {
  ensureStringList,
  numberedParagraphs,
  splitParagraphs,
} from "./aiReportText.utils";

export type TAiReportPrintSection = {
  title: string;
  paragraphs: string[];
};

export const AI_REPORT_FOOTER_TAGLINE =
  "광고 성과의 핵심 흐름을 요약한 보고서입니다. 상세 분석은 본문을 참고해 주세요.";

export type TAiReportPrintDocument = {
  documentTitle: string;
  label: string;
  writtenDate: string;
  brandName: string;
  footerTagline: string;
  executiveSummary: string[];
  bodySections: TAiReportPrintSection[];
};

export type TAiReportPrintOptions = {
  documentTitle?: string;
  brandName?: string;
  footerTagline?: string;
};

const DEFAULT_PRINT_DOCUMENT_TITLE = "통합 광고 성과 AI 요약 보고서";
const DEFAULT_PRINT_BRAND_NAME = "WhereYouAd";
const DEFAULT_PRINT_LABEL = "광고 성과 AI 요약";

export function getAiSummaryPrintOptions(
  provider: TAiAnalysisProvider,
): TAiReportPrintOptions {
  if (provider === "ALL") {
    return { documentTitle: DEFAULT_PRINT_DOCUMENT_TITLE };
  }
  const platformLabel = PLATFORM_MAP[provider];
  return {
    documentTitle: `${platformLabel} 광고 성과 AI 요약 보고서`,
  };
}

/** 인쇄·PDF용 작성일 */
export function formatReportWrittenDate(date = new Date()) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function toAiReportPrintDocument(
  data: IAnalysisResponse,
  options?: TAiReportPrintOptions & { writtenDate?: string },
): TAiReportPrintDocument {
  const writtenDate = options?.writtenDate ?? formatReportWrittenDate();
  const summaryLines = splitParagraphs(data.performanceSummary);

  const bodySections: TAiReportPrintSection[] = [
    {
      title: "성과 요약",
      paragraphs: [
        ...splitParagraphs(data.performanceSummary),
        ...numberedParagraphs(ensureStringList(data.performancePoint)),
      ],
    },
    {
      title: "원인 분석",
      paragraphs: splitParagraphs(data.analysisReason),
    },
    {
      title: "전략 제안",
      paragraphs: splitParagraphs(data.strategySuggestion),
    },
    {
      title: "주의사항",
      paragraphs: numberedParagraphs(ensureStringList(data.cautionPoint)),
    },
  ];

  return {
    documentTitle: options?.documentTitle ?? DEFAULT_PRINT_DOCUMENT_TITLE,
    label: DEFAULT_PRINT_LABEL,
    writtenDate,
    brandName: options?.brandName ?? DEFAULT_PRINT_BRAND_NAME,
    footerTagline: options?.footerTagline ?? AI_REPORT_FOOTER_TAGLINE,
    executiveSummary: summaryLines.length
      ? summaryLines.slice(0, 5)
      : [AI_REPORT_FOOTER_TAGLINE],
    bodySections,
  };
}
