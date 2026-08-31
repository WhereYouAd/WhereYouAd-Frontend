import type { ApexOptions } from "apexcharts";

/** 화면 표시용 — 전체보기 (시리즈 겹침 대비 연한 fill) */
export const ALL_PLATFORM_TRAFFIC_STROKE: ApexOptions["stroke"] = {
  curve: "smooth",
  width: 2,
};

export const ALL_PLATFORM_TRAFFIC_FILL: ApexOptions["fill"] = {
  type: "gradient",
  gradient: {
    shadeIntensity: 1,
    opacityFrom: 0.2,
    opacityTo: 0.05,
    stops: [20, 100],
  },
};

/** 화면 표시용 — 개별 플랫폼 (단일 시리즈라 fill을 더 진하게) */
export const SINGLE_PLATFORM_TRAFFIC_STROKE: ApexOptions["stroke"] = {
  curve: "smooth",
  width: 2,
};

export const SINGLE_PLATFORM_TRAFFIC_FILL: ApexOptions["fill"] = {
  type: "gradient",
  gradient: {
    shadeIntensity: 1,
    opacityFrom: 0.45,
    opacityTo: 0.05,
    stops: [20, 100],
  },
};
