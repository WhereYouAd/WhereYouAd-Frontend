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

    const markerRect = marker.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    setMarkerPos({
      x: markerRect.left + markerRect.width / 2 - containerRect.left,
      y: markerRect.top + markerRect.height / 2 - containerRect.top,
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
