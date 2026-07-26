import { describe, expect, it } from "vitest";

import {
  getKpiMetric,
  getMetricKpiTitle,
  METRIC_REGISTRY,
  OVERVIEW_KPI_BINDINGS,
} from "@/utils/dashboard/metricRegistry";

describe("METRIC_REGISTRY", () => {
  describe("clicks", () => {
    it("label이 '클릭수'이다", () => {
      expect(METRIC_REGISTRY.clicks.label).toBe("클릭수");
    });
    it("format: 천 단위 콤마 (ko-KR)", () => {
      expect(METRIC_REGISTRY.clicks.format(1500)).toBe("1,500");
    });
    it("formatDelta: 양수 → toFixed(2)%", () => {
      expect(METRIC_REGISTRY.clicks.formatDelta(0.2)).toBe("0.20%");
    });
    it("formatDelta: 음수 → Math.abs 적용으로 부호 없음", () => {
      // formatPercentDelta = (v) => `${Math.abs(v).toFixed(2)}%`
      expect(METRIC_REGISTRY.clicks.formatDelta(-0.05)).toBe("0.05%");
    });
    it("formatDelta: 0 → '0.00%'", () => {
      expect(METRIC_REGISTRY.clicks.formatDelta(0)).toBe("0.00%");
    });
  });

  describe("impressions", () => {
    it("label이 '노출수'이다", () => {
      expect(METRIC_REGISTRY.impressions.label).toBe("노출수");
    });
    it("format: 천 단위 콤마", () => {
      expect(METRIC_REGISTRY.impressions.format(50000)).toBe("50,000");
    });
    it("formatDelta: 음수 → 절댓값", () => {
      expect(METRIC_REGISTRY.impressions.formatDelta(-3.0)).toBe("3.00%");
    });
  });

  describe("conversion", () => {
    it("label이 'CVR(전환율)'이다", () => {
      expect(METRIC_REGISTRY.conversion.label).toBe("CVR(전환율)");
    });
    it("kpiLabel이 '전환율'이다", () => {
      expect(METRIC_REGISTRY.conversion.kpiLabel).toBe("전환율");
    });
    it("format: toFixed(2)%", () => {
      expect(METRIC_REGISTRY.conversion.format(2.5)).toBe("2.50%");
    });
    it("formatDelta: 음수 → 절댓값", () => {
      expect(METRIC_REGISTRY.conversion.formatDelta(-1.5)).toBe("1.50%");
    });
  });

  describe("roas", () => {
    it("label이 'ROAS'이다", () => {
      expect(METRIC_REGISTRY.roas.label).toBe("ROAS");
    });
    it("format: toFixed(2)%", () => {
      expect(METRIC_REGISTRY.roas.format(150.75)).toBe("150.75%");
    });
    it("formatDelta: 음수 → 절댓값", () => {
      expect(METRIC_REGISTRY.roas.formatDelta(-1.25)).toBe("1.25%");
    });
  });

  describe("spend", () => {
    it("label이 '비용(지출)'이다", () => {
      expect(METRIC_REGISTRY.spend.label).toBe("비용(지출)");
    });
    it("format: Math.round 후 ₩ + 천 단위 콤마", () => {
      expect(METRIC_REGISTRY.spend.format(1500000.7)).toBe("₩1,500,001");
    });
    it("format: 정수 → ₩ + 천 단위 콤마", () => {
      expect(METRIC_REGISTRY.spend.format(1500000)).toBe("₩1,500,000");
    });
    it("format: 소수점 .4 이하 → 내림", () => {
      expect(METRIC_REGISTRY.spend.format(999.4)).toBe("₩999");
    });
  });

  describe("ctr", () => {
    it("format: toFixed(2)%", () => {
      expect(METRIC_REGISTRY.ctr.format(3.14)).toBe("3.14%");
    });
  });

  describe("cpa", () => {
    it("format: Math.round 후 ₩ + 천 단위 콤마", () => {
      expect(METRIC_REGISTRY.cpa.format(50000.4)).toBe("₩50,000");
    });
  });

  describe("revenue / adSpend", () => {
    it("revenue format: ₩ 통화 포맷", () => {
      expect(METRIC_REGISTRY.revenue.format(2000000)).toBe("₩2,000,000");
    });
    it("adSpend format: ₩ 통화 포맷", () => {
      expect(METRIC_REGISTRY.adSpend.format(300000)).toBe("₩300,000");
    });
  });
});

describe("getKpiMetric", () => {
  it("반환값에 format, formatDelta 함수가 있다", () => {
    const metric = getKpiMetric("clicks");
    expect(typeof metric.format).toBe("function");
    expect(typeof metric.formatDelta).toBe("function");
  });

  it("conversion 반환 시 format이 percent 포맷터이다", () => {
    const metric = getKpiMetric("conversion");
    expect(metric.format(5.0)).toBe("5.00%");
  });
});

describe("getMetricKpiTitle", () => {
  it("conversion → kpiLabel '전환율'", () => {
    expect(getMetricKpiTitle("conversion")).toBe("전환율");
  });
  it("clicks → label '클릭수'", () => {
    expect(getMetricKpiTitle("clicks")).toBe("클릭수");
  });
  it("impressions → label '노출수'", () => {
    expect(getMetricKpiTitle("impressions")).toBe("노출수");
  });
  it("roas → label 'ROAS'", () => {
    expect(getMetricKpiTitle("roas")).toBe("ROAS");
  });
});

describe("OVERVIEW_KPI_BINDINGS", () => {
  it("4개 항목이다", () => {
    expect(OVERVIEW_KPI_BINDINGS).toHaveLength(4);
  });
  it("순서: clicks → impressions → conversion → roas", () => {
    const keys = OVERVIEW_KPI_BINDINGS.map((b) => b.registryKey);
    expect(keys).toEqual(["clicks", "impressions", "conversion", "roas"]);
  });
  it("각 항목에 registryKey, valueField, deltaField가 있다", () => {
    for (const binding of OVERVIEW_KPI_BINDINGS) {
      expect(binding).toHaveProperty("registryKey");
      expect(binding).toHaveProperty("valueField");
      expect(binding).toHaveProperty("deltaField");
    }
  });
});
