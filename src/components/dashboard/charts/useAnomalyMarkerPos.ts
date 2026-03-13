import { type RefObject, useCallback, useEffect, useState } from "react";

// SVG annotation 마커의 컨테이너 기준 좌표를 추적하는 훅
export function useAnomalyMarkerPos(
  containerRef: RefObject<HTMLDivElement | null>,
) {
  const [markerPos, setMarkerPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const updateMarkerPos = useCallback(() => {
    if (!containerRef.current) return;
    const marker = containerRef.current.querySelector<SVGCircleElement>(
      ".apexcharts-point-annotation-marker",
    );
    if (!marker) return;

    const svg = containerRef.current.querySelector<SVGSVGElement>("svg");
    if (!svg) return;
    const ctm = marker.getScreenCTM();
    if (!ctm) return;

    const pt = svg.createSVGPoint();
    pt.x = parseFloat(marker.getAttribute("cx") ?? "0");
    pt.y = parseFloat(marker.getAttribute("cy") ?? "0");
    const screenPt = pt.matrixTransform(ctm);

    const containerRect = containerRef.current.getBoundingClientRect();
    setMarkerPos({
      x: screenPt.x - containerRect.left,
      y: screenPt.y - containerRect.top,
    });
  }, [containerRef]);

  // 마운트 후 및 리사이즈 시 마커 좌표 갱신
  useEffect(() => {
    const timer = setTimeout(updateMarkerPos, 300);
    const observer = new ResizeObserver(updateMarkerPos);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [updateMarkerPos, containerRef]);

  return markerPos;
}
