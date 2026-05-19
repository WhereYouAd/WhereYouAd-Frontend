import type { IAiReportResponse } from "@/types/dashboard/overview";

export type TAiReportPrintSection = {
  title: string;
  paragraphs: string[];
};

export type TAiReportPrintMetric = {
  label: string;
  value: string;
  detail?: string;
};

export const AI_REPORT_FOOTER_TAGLINE =
  "오늘 광고 성과의 핵심 흐름을 요약한 보고서입니다. 상세 분석은 본문을 참고해 주세요.";

export type TAiReportPrintDocument = {
  documentTitle: string;
  label: string;
  writtenDate: string;
  brandName: string;
  footerTagline: string;
  executiveSummary: string[];
  keyMetrics: TAiReportPrintMetric[];
  bodySections: TAiReportPrintSection[];
};

const SECTION_TITLE_CAUSE = "왜 이렇게 나왔을까?";
const SECTION_TITLE_PERFORMANCE = "성과 요약";
const SECTION_TITLE_HIGHLIGHT = "성과 포인트";

function splitParagraphs(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function findSection(data: IAiReportResponse, title: string) {
  return data.sections.find((section) => section.title === title);
}

/** 인쇄·PDF용 작성일 (한국어) */
export function formatReportWrittenDate(date = new Date()) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function buildExecutiveSummary(data: IAiReportResponse): string[] {
  if (data.executiveSummary?.length) {
    return data.executiveSummary.slice(0, 5);
  }

  return [data.title, AI_REPORT_FOOTER_TAGLINE].slice(0, 5);
}

/** 성과 요약 → 원인 분석 → 전략 제안 → 주의사항 */
function buildBodySections(data: IAiReportResponse): TAiReportPrintSection[] {
  const performance = findSection(data, SECTION_TITLE_PERFORMANCE);
  const highlight = findSection(data, SECTION_TITLE_HIGHLIGHT);
  const cause = findSection(data, SECTION_TITLE_CAUSE);

  const sections: TAiReportPrintSection[] = [];

  if (performance || highlight) {
    const paragraphs = [
      ...(performance ? splitParagraphs(performance.content) : []),
      ...(highlight ? splitParagraphs(highlight.content) : []),
    ];
    sections.push({
      title: "성과 요약",
      paragraphs,
    });
  }

  if (cause) {
    sections.push({
      title: "원인 분석",
      paragraphs: splitParagraphs(cause.content),
    });
  }

  sections.push({
    title: data.strategySuggestion.title,
    paragraphs: splitParagraphs(data.strategySuggestion.content),
  });

  sections.push({
    title: "주의사항",
    paragraphs: splitParagraphs(data.warning.content),
  });

  return sections;
}

/** API 응답 → 보고서 인쇄 문서 구조 */
export function toAiReportPrintDocument(
  data: IAiReportResponse,
  writtenDate = formatReportWrittenDate(),
): TAiReportPrintDocument {
  return {
    documentTitle: "오늘의 성과 AI 요약 보고서",
    label: data.label,
    writtenDate,
    brandName: "WhereYouAd",
    footerTagline: AI_REPORT_FOOTER_TAGLINE,
    executiveSummary: buildExecutiveSummary(data),
    keyMetrics: data.keyMetrics ?? [],
    bodySections: buildBodySections(data),
  };
}
