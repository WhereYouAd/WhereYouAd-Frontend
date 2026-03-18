import { type RefObject, useEffect, useState } from "react";

// 이상 징후 빨간 점(annotation marker)의 컨테이너 기준 좌표를 반환하는 훅
export function useAnomalyMarkerPos(
  containerRef: RefObject<HTMLDivElement | null>,
) {
  const [markerPos, setMarkerPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  // 차트 마운트 후(300ms 대기) 및 리사이즈 시 좌표 갱신
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateMarkerPos = () => {
      // DOM에서 ApexCharts annotation 마커 요소 탐색
      const marker = container.querySelector<SVGCircleElement>(
        ".apexcharts-point-annotation-marker",
      );
      if (!marker) return;

      // getBoundingClientRect으로 뷰포트 기준 위치 계산 후 컨테이너 기준으로 변환
      const markerRect = marker.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setMarkerPos({
        x: markerRect.left + markerRect.width / 2 - containerRect.left,
        y: markerRect.top + markerRect.height / 2 - containerRect.top,
      });
    };

    const timer = setTimeout(updateMarkerPos, 300);
    const observer = new ResizeObserver(updateMarkerPos);
    observer.observe(container);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [containerRef]);

  return markerPos;
}
