/** AI 요약 보고서 인쇄·PDF 저장 전용 마크업 */
import { AI_REPORT_LOGO_PRINT_SVG } from "../aiReport.printAssets";
import type { TAiReportPrintDocument } from "../aiReport.utils";

type TOverviewAiSummaryPrintReportProps = {
  document: TAiReportPrintDocument;
};

function AiReportLogo({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <div
      className={className}
      role="img"
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: AI_REPORT_LOGO_PRINT_SVG }}
    />
  );
}

export default function OverviewAiSummaryPrintReport({
  document: doc,
}: TOverviewAiSummaryPrintReportProps) {
  return (
    <div className="ai-report-print-root" aria-hidden>
      {/* 1페이지: 표지 */}
      <section className="ai-report-cover" aria-label="표지">
        <div className="ai-report-cover-main">
          <header className="ai-report-cover-top">
            <AiReportLogo
              className="ai-report-cover-logo"
              label={doc.brandName}
            />
          </header>

          <span className="ai-report-cover-divider" aria-hidden="true" />

          <div className="ai-report-cover-body">
            <p className="ai-report-cover-label">{doc.label}</p>
            <h1 className="ai-report-cover-title">{doc.documentTitle}</h1>

            <div className="ai-report-cover-meta-panel">
              <dl className="ai-report-cover-meta">
                <div className="ai-report-cover-meta-row">
                  <dt>작성일</dt>
                  <dd>{doc.writtenDate}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 2페이지~: 요약·본문 + 하단 푸터 */}
      <section className="ai-report-document" aria-label="보고서 본문">
        <div className="ai-report-document-inner">
          {/* 2페이지: 요약본 + 핵심 지표 */}
          <div className="ai-report-chunk ai-report-chunk--front">
            <article
              className="ai-report-section ai-report-section--lead"
              aria-labelledby="ai-report-exec-heading"
            >
              <h3
                id="ai-report-exec-heading"
                className="ai-report-section-title"
              >
                요약본 (Executive Summary)
              </h3>
              <p className="ai-report-section-desc">AI가 생성한 핵심 요약</p>
              <ul className="ai-report-list">
                {doc.executiveSummary.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </article>

            {doc.keyMetrics.length > 0 && (
              <article
                className="ai-report-section ai-report-section--metrics"
                aria-labelledby="ai-report-metrics-heading"
              >
                <h3
                  id="ai-report-metrics-heading"
                  className="ai-report-section-title"
                >
                  핵심 지표
                </h3>
                <p className="ai-report-section-desc">오늘의 주요 수치</p>
                <ul className="ai-report-list">
                  {doc.keyMetrics.map((metric) => (
                    <li key={metric.label}>
                      {metric.label}: {metric.value}
                      {metric.detail ? ` (${metric.detail})` : ""}
                    </li>
                  ))}
                </ul>
              </article>
            )}
          </div>

          {/* 3페이지~: 본문 */}
          <div
            className="ai-report-chunk ai-report-chunk--main"
            aria-labelledby="ai-report-body-heading"
          >
            <h2 id="ai-report-body-heading" className="ai-report-main-title">
              본문
            </h2>
            <p className="ai-report-main-desc">주요 내용 요약</p>

            <div className="ai-report-main-sections">
              {doc.bodySections.map((section, sectionIndex) => (
                <article
                  key={`${section.title}-${sectionIndex}`}
                  className="ai-report-section"
                  aria-labelledby={`ai-report-section-${sectionIndex}`}
                >
                  <h3
                    id={`ai-report-section-${sectionIndex}`}
                    className="ai-report-section-title"
                  >
                    <span className="ai-report-section-num" aria-hidden>
                      {sectionIndex + 1}.
                    </span>
                    {section.title}
                  </h3>
                  <ul className="ai-report-list">
                    {section.paragraphs.map((paragraph, index) => (
                      <li key={index}>{paragraph}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>

        <footer className="ai-report-footer" aria-hidden="true">
          <AiReportLogo
            className="ai-report-footer-logo"
            label={doc.brandName}
          />
          <p className="ai-report-footer-tagline">{doc.footerTagline}</p>
        </footer>
      </section>
    </div>
  );
}
