import { describe, expect, it } from "vitest";

import type { IMetricsResponse } from "@/types/dashboard/common";

import { metricsToKpis } from "@/utils/dashboard/metricsToKpis";

const baseMetrics: IMetricsResponse = {
  clicks: 1000,
  clickChangeRate: 0.2,
  impressions: 50000,
  impressionChangeRate: -0.05,
  conversion: 2.5,
  cvrChangeRate: 0.1,
  ROAS: 150.75,
  ROASChangeRate: -1.25,
};

describe("metricsToKpis", () => {
  it("OVERVIEW_KPI_BINDINGS 순서대로 4개 KPI를 반환한다", () => {
    expect(metricsToKpis(baseMetrics)).toHaveLength(4);
  });

  describe("clicks KPI (index 0)", () => {
    it("title이 '클릭수'이다", () => {
      const [kpi] = metricsToKpis(baseMetrics);
      expect(kpi.title).toBe("클릭수");
    });
    it("value가 천 단위 콤마 포맷이다", () => {
      const [kpi] = metricsToKpis(baseMetrics);
      expect(kpi.value).toBe("1,000");
    });
    it("양수 delta → direction 'up'", () => {
      const [kpi] = metricsToKpis(baseMetrics);
      expect(kpi.trend?.direction).toBe("up");
    });
    it("trend.value는 절댓값 퍼센트 포맷이다", () => {
      const [kpi] = metricsToKpis(baseMetrics);
      expect(kpi.trend?.value).toBe("0.20%");
    });
  });

  describe("impressions KPI (index 1)", () => {
    it("title이 '노출수'이다", () => {
      const result = metricsToKpis(baseMetrics);
      expect(result[1].title).toBe("노출수");
    });
    it("value가 천 단위 콤마 포맷이다", () => {
      const result = metricsToKpis(baseMetrics);
      expect(result[1].value).toBe("50,000");
    });
    it("음수 delta → direction 'down'", () => {
      const result = metricsToKpis(baseMetrics);
      expect(result[1].trend?.direction).toBe("down");
    });
    it("trend.value는 Math.abs 적용으로 부호 없음", () => {
      const result = metricsToKpis(baseMetrics);
      expect(result[1].trend?.value).toBe("0.05%");
    });
  });

  describe("conversion KPI (index 2)", () => {
    it("title이 '전환율'이다 (kpiLabel 우선)", () => {
      const result = metricsToKpis(baseMetrics);
      expect(result[2].title).toBe("전환율");
    });
    it("value가 toFixed(2)% 포맷이다", () => {
      const result = metricsToKpis(baseMetrics);
      expect(result[2].value).toBe("2.50%");
    });
    it("양수 delta → direction 'up'", () => {
      const result = metricsToKpis(baseMetrics);
      expect(result[2].trend?.direction).toBe("up");
    });
  });

  describe("roas KPI (index 3)", () => {
    it("title이 'ROAS'이다", () => {
      const result = metricsToKpis(baseMetrics);
      expect(result[3].title).toBe("ROAS");
    });
    it("value가 toFixed(2)% 포맷이다", () => {
      const result = metricsToKpis(baseMetrics);
      expect(result[3].value).toBe("150.75%");
    });
    it("음수 delta → direction 'down'", () => {
      const result = metricsToKpis(baseMetrics);
      expect(result[3].trend?.direction).toBe("down");
    });
    it("trend.value는 절댓값 포맷 (1.25%)", () => {
      const result = metricsToKpis(baseMetrics);
      expect(result[3].trend?.value).toBe("1.25%");
    });
  });

  describe("경계값", () => {
    it("delta = 0 → direction 'up' (>= 0 조건)", () => {
      const metrics = { ...baseMetrics, clickChangeRate: 0 };
      const [kpi] = metricsToKpis(metrics);
      expect(kpi.trend?.direction).toBe("up");
      expect(kpi.trend?.value).toBe("0.00%");
    });

    it("clicks = 0 → value '0'", () => {
      const metrics = { ...baseMetrics, clicks: 0 };
      const [kpi] = metricsToKpis(metrics);
      expect(kpi.value).toBe("0");
    });

    it("ROAS 소수점 2자리 초과 → toFixed(2) 반올림", () => {
      const metrics = { ...baseMetrics, ROAS: 100.555 };
      const result = metricsToKpis(metrics);
      expect(result[3].value).toBe("100.56%");
    });
  });
});
