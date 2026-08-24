import ApexCharts from "apexcharts";
import { toast } from "sonner";

import { PLATFORM_CHART_COLORS } from "@/types/dashboard/provider";

type TExportMode = "line-forward" | "preserve-fill";

type TDownloadOptions = {
  /**
   * line-forward: fill 제거 + stroke 강조 (플랫폼 전체보기)
   * preserve-fill: 화면 fill 유지 + stroke 색 고정 (플랫폼 개별)
   */
  mode?: TExportMode;
  /** SVG 복제 저장 시 컨테이너 ID */
  containerId?: string;
};

const SERIES_PATH_SELECTOR = [
  ".apexcharts-series path",
  ".apexcharts-area-series path",
  ".apexcharts-line-series path",
  ".apexcharts-area",
  ".apexcharts-line",
].join(", ");

/** PNG/SVG에 var()가 안 먹히므로, 저장 직전에 토큰을 해석한 값을 넣음 */
const INFO_BLUE_TOKEN = "var(--color-info-blue)";
const EXPORT_BG_TOKEN = "var(--color-surface-100)";

/** Apex seriesName → 플랫폼 차트 색 토큰 */
const SERIES_TOKEN_BY_NAME: Record<string, string> = {
  Google: PLATFORM_CHART_COLORS.GOOGLE,
  NAVER: PLATFORM_CHART_COLORS.NAVER,
  Meta: PLATFORM_CHART_COLORS.META,
};

/** 닫힌 area fill path — 여기에 stroke를 주면 아래·옆까지 테두리가 생김 */
function isAreaFillPath(el: Element): boolean {
  const fill = el.getAttribute("fill");
  const stroke = el.getAttribute("stroke");
  // Apex area: fill 있음 + stroke none / 0
  if (fill && fill !== "none") return true;
  if (stroke === "none") return true;
  return false;
}

/** 데이터 선만 그리는 path (fill none + stroke) */
function isLineStrokePath(el: Element): boolean {
  const fill = el.getAttribute("fill");
  const stroke = el.getAttribute("stroke");
  return (
    (fill === "none" || fill == null) && Boolean(stroke && stroke !== "none")
  );
}

function resolveCssColor(color: string): string {
  if (!color || color === "none" || color === "transparent") return color;
  if (!color.includes("var(")) return color;

  const el = document.createElement("span");
  el.style.color = color;
  document.body.appendChild(el);
  const resolved = getComputedStyle(el).color;
  el.remove();

  if (
    !resolved ||
    resolved === "rgba(0, 0, 0, 0)" ||
    resolved === "transparent"
  ) {
    return color;
  }
  return resolved;
}

function seriesColorFallback(el: Element): string | null {
  const group = el.closest(".apexcharts-series");
  const rawName = group?.getAttribute("seriesName") ?? "";
  // 플랫폼 시리즈명만 매칭. realIndex로 추론하면 통합(클릭수, index 0)이 Google 노랑으로 잘못 잡힘
  const token = SERIES_TOKEN_BY_NAME[rawName];
  return token ? resolveCssColor(token) : null;
}

function getChartSvg(containerId: string): SVGSVGElement | null {
  const root = document.getElementById(containerId);
  if (!root) return null;
  return (
    (root.querySelector("svg.apexcharts-svg") as SVGSVGElement | null) ??
    (root.querySelector("svg") as SVGSVGElement | null)
  );
}

function resolveSeriesStroke(livePath: Element, clonePath: SVGElement): string {
  const computed = getComputedStyle(livePath);
  const fromComputed =
    computed.stroke && computed.stroke !== "none" ? computed.stroke : null;
  const fromAttr = clonePath.getAttribute("stroke");

  // 화면 계산색 우선 → 플랫폼 토큰 해석 → info-blue 토큰 해석
  return (
    (fromComputed && !fromComputed.includes("var(") ? fromComputed : null) ??
    (fromAttr && fromAttr !== "none"
      ? fromAttr.includes("var(")
        ? resolveCssColor(fromAttr)
        : fromAttr
      : null) ??
    seriesColorFallback(livePath) ??
    resolveCssColor(INFO_BLUE_TOKEN)
  );
}

/** 플롯 상·하 테두리 그룹 */
function isPlotBorderChrome(el: Element): boolean {
  return Boolean(el.closest('[class*="grid-borders"]'));
}

/**
 * 맨 위 가로선만 제거/그리드 가로선은 남김
 */
function removePlotRoofLine(clone: SVGSVGElement) {
  clone.querySelectorAll('[class*="grid-borders"]').forEach((el) => {
    el.remove();
  });

  const scope =
    clone.querySelector(".apexcharts-inner") ??
    clone.querySelector(".apexcharts-graphical") ??
    clone;

  const roofCandidates = [...scope.querySelectorAll("line")].filter((el) => {
    // 시리즈(데이터) 선은 건드리지 않음
    if (el.closest(".apexcharts-series")) return false;

    const y1 = parseFloat(el.getAttribute("y1") ?? "NaN");
    const y2 = parseFloat(el.getAttribute("y2") ?? "NaN");
    const x1 = parseFloat(el.getAttribute("x1") ?? "NaN");
    const x2 = parseFloat(el.getAttribute("x2") ?? "NaN");
    if ([y1, y2, x1, x2].some((v) => Number.isNaN(v))) return false;
    if (Math.abs(y1 - y2) > 0.5) return false; // 가로선만
    if (Math.abs(x2 - x1) < 40) return false; // 짧은 tick 제외
    return true;
  });

  if (roofCandidates.length === 0) return;

  roofCandidates.sort(
    (a, b) =>
      parseFloat(a.getAttribute("y1")!) - parseFloat(b.getAttribute("y1")!),
  );
  // y가 가장 작은 가로선 = 플롯 천장
  roofCandidates[0]?.remove();
}

/**
 * Apex dataURI는 stroke var(--*)를 해석하지 않아 선이 빠진다.
 * 화면 SVG를 복제해 실제 색을 심은 뒤 저장한다.
 */
function cloneSvgForExport(
  liveSvg: SVGSVGElement,
  mode: TExportMode,
): SVGSVGElement {
  const clone = liveSvg.cloneNode(true) as SVGSVGElement;
  const liveNodes = liveSvg.querySelectorAll("*");
  const cloneNodes = clone.querySelectorAll("*");

  liveNodes.forEach((liveNode, index) => {
    const cloneNode = cloneNodes[index];
    if (
      !(liveNode instanceof SVGElement) ||
      !(cloneNode instanceof SVGElement)
    ) {
      return;
    }

    // 지붕/바닥 테두리는 색 인라인하지 않음 (아래에서 그룹 제거)
    if (isPlotBorderChrome(liveNode)) {
      return;
    }

    const computed = getComputedStyle(liveNode);
    const attrFill = liveNode.getAttribute("fill");
    const attrStroke = liveNode.getAttribute("stroke");

    if (attrFill && attrFill !== "none" && !attrFill.startsWith("url(")) {
      const fill = computed.fill;
      if (fill && fill !== "none") {
        cloneNode.setAttribute("fill", fill);
      }
    } else if (attrFill?.includes("var(")) {
      cloneNode.setAttribute("fill", resolveCssColor(attrFill));
    }

    if (attrStroke && attrStroke !== "none") {
      const stroke = computed.stroke;
      if (stroke && stroke !== "none") {
        cloneNode.setAttribute("stroke", stroke);
      } else if (attrStroke.includes("var(")) {
        cloneNode.setAttribute("stroke", resolveCssColor(attrStroke));
      }
    }

    if (liveNode.tagName.toLowerCase() === "stop") {
      const stopColor = computed.stopColor;
      if (stopColor && stopColor !== "none") {
        cloneNode.setAttribute("stop-color", stopColor);
      }
    }
  });

  const livePaths = liveSvg.querySelectorAll(SERIES_PATH_SELECTOR);
  const clonePaths = clone.querySelectorAll(SERIES_PATH_SELECTOR);

  livePaths.forEach((livePath, index) => {
    const clonePath = clonePaths[index] as SVGElement | undefined;
    if (!clonePath) return;

    // Apex area는 fill path(닫힌 면) + line path(위쪽 선)를 따로 그림
    const linePath = isLineStrokePath(livePath);
    const areaPath = isAreaFillPath(livePath);

    if (mode === "line-forward") {
      clonePath.setAttribute("fill", "none");
      clonePath.setAttribute("fill-opacity", "0");
      if (!linePath) {
        // 닫힌 area fill path에는 선을 주지 않음
        clonePath.setAttribute("stroke", "none");
        clonePath.setAttribute("stroke-opacity", "0");
        return;
      }
    } else if (areaPath && !linePath) {
      // preserve-fill: 면만 유지, 테두리 선 제거 (화면과 동일)
      clonePath.setAttribute("stroke", "none");
      clonePath.setAttribute("stroke-width", "0");
      clonePath.setAttribute("stroke-opacity", "0");
      return;
    }

    if (!linePath && !areaPath) return;

    const stroke = resolveSeriesStroke(livePath, clonePath);
    clonePath.setAttribute("stroke", stroke);
    clonePath.setAttribute(
      "stroke-width",
      mode === "line-forward" ? "2" : "1.5",
    );
    clonePath.setAttribute("stroke-opacity", "1");
    clonePath.setAttribute("stroke-linecap", "round");
    clonePath.setAttribute("stroke-linejoin", "round");
  });

  removePlotRoofLine(clone);

  const rect = liveSvg.getBoundingClientRect();
  const width = Math.max(Math.round(rect.width), 1);
  const height = Math.max(Math.round(rect.height), 1);
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  if (!clone.getAttribute("viewBox")) {
    clone.setAttribute("viewBox", `0 0 ${width} ${height}`);
  }

  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("x", "0");
  bg.setAttribute("y", "0");
  bg.setAttribute("width", "100%");
  bg.setAttribute("height", "100%");
  bg.setAttribute("fill", resolveCssColor(EXPORT_BG_TOKEN));
  clone.insertBefore(bg, clone.firstChild);

  return clone;
}

function serializeSvg(svg: SVGSVGElement): string {
  return new XMLSerializer().serializeToString(svg);
}

function svgToPngDataUri(svg: SVGSVGElement, scale = 2): Promise<string> {
  const width = Number(svg.getAttribute("width")) || 640;
  const height = Number(svg.getAttribute("height")) || 280;
  const svgData = serializeSvg(svg);
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas context 생성 실패"));
        return;
      }
      ctx.fillStyle = resolveCssColor(EXPORT_BG_TOKEN);
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("SVG → PNG 변환 실패"));
    img.src = url;
  });
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
}

async function downloadWithSvgClone(
  containerId: string,
  filename: string,
  mode: TExportMode,
  format: "png" | "svg",
) {
  const liveSvg = getChartSvg(containerId);
  if (!liveSvg) {
    throw new Error(`차트 SVG를 찾을 수 없습니다: ${containerId}`);
  }

  const exportSvg = cloneSvgForExport(liveSvg, mode);

  if (format === "png") {
    const imgURI = await svgToPngDataUri(exportSvg, 2);
    triggerDownload(imgURI, `${filename}.png`);
    return;
  }

  const svgData = serializeSvg(exportSvg);
  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${filename}.svg`);
  URL.revokeObjectURL(url);
}

export async function downloadChartPng(
  chartId: string,
  filename: string,
  options?: TDownloadOptions,
) {
  try {
    if (options?.mode) {
      const containerId = options.containerId ?? `${chartId}-container`;
      await downloadWithSvgClone(containerId, filename, options.mode, "png");
      return;
    }

    const { imgURI } = (await ApexCharts.exec(chartId, "dataURI")) as {
      imgURI: string;
    };
    triggerDownload(imgURI, `${filename}.png`);
  } catch (e) {
    console.error("PNG 저장 실패:", e);
    toast.error("차트 저장에 실패했습니다.");
  }
}

export async function downloadChartSvg(
  containerId: string,
  filename: string,
  options?: TDownloadOptions,
) {
  try {
    if (options?.mode) {
      await downloadWithSvgClone(containerId, filename, options.mode, "svg");
      return;
    }

    const svgEl = document.getElementById(containerId)?.querySelector("svg");
    if (!svgEl) {
      throw new Error(`차트 SVG를 찾을 수 없습니다: ${containerId}`);
    }
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${filename}.svg`);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error("SVG 저장 실패:", e);
    toast.error("차트 저장에 실패했습니다.");
  }
}

export function downloadChartCsv(chartId: string) {
  ApexCharts.exec(chartId, "exportToCSV");
}
