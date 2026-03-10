import ApexCharts from "apexcharts";

export async function downloadChartPng(chartId: string, filename: string) {
  try {
    const { imgURI } = (await ApexCharts.exec(chartId, "dataURI")) as {
      imgURI: string;
    };
    const a = document.createElement("a");
    a.href = imgURI;
    a.download = `${filename}.png`;
    a.click();
  } catch (e) {
    console.error("PNG 저장 실패:", e);
  }
}

export function downloadChartSvg(containerId: string, filename: string) {
  const svgEl = document.getElementById(containerId)?.querySelector("svg");
  if (!svgEl) return;
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const blob = new Blob([svgData], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadChartCsv(chartId: string) {
  ApexCharts.exec(chartId, "exportToCSV");
}

export function printAsPdf(printClass: string) {
  document.body.classList.add(printClass);
  const cleanup = () => {
    document.body.classList.remove(printClass);
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  setTimeout(() => window.print(), 150);
}
