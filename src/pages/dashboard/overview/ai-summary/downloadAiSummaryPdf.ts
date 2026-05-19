import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { buildPrintThemeStyleBlock } from "./aiReport.printAssets";
import type { TAiReportPrintDocument } from "./aiReport.utils";
import OverviewAiSummaryPrintReport from "./print/OverviewAiSummaryPrintReport";

import printStyles from "@/styles/aiReport.print.css?inline";
import tokenStyles from "@/styles/tokens.css?inline";

const FONT_FACE_STYLE = `
@font-face {
  font-family: "Pretendard";
  src: url("/fonts/PretendardVariable.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}
`;

/** about:blank iframe 인쇄 — Chrome URL 머리글(localhost) 제거 */
export function downloadAiSummaryPdf(document: TAiReportPrintDocument) {
  const reportMarkup = renderToStaticMarkup(
    createElement(OverviewAiSummaryPrintReport, { document }),
  );

  const iframe = window.document.createElement("iframe");
  iframe.setAttribute(
    "style",
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden",
  );
  iframe.setAttribute("title", "AI 요약 보고서 인쇄");
  window.document.body.appendChild(iframe);

  const printWindow = iframe.contentWindow;
  if (!printWindow) {
    iframe.remove();
    return;
  }

  const printThemeStyles = buildPrintThemeStyleBlock();
  const printDoc = printWindow.document;
  printDoc.open();
  printDoc.write(`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title></title>
<style>${FONT_FACE_STYLE}${tokenStyles}${printThemeStyles}${printStyles}</style>
</head>
<body>${reportMarkup}</body>
</html>`);
  printDoc.close();

  const cleanup = () => {
    iframe.remove();
    printWindow.removeEventListener("afterprint", cleanup);
  };
  printWindow.addEventListener("afterprint", cleanup);

  const runPrint = () => {
    printWindow.focus();
    printWindow.print();
  };

  if (printDoc.fonts) {
    void printDoc.fonts.ready.then(() => {
      setTimeout(runPrint, 100);
    });
  } else {
    setTimeout(runPrint, 300);
  }
}
