import { expect, type Page, test } from "./fixtures/auth";

const CARD_TITLE = "통합 광고 성과 AI 요약";
const MOCK_TOKEN = "mock-ai-token-e2e";

/** POST /api/ai/organizations/{orgId}/analysis 모킹 */
async function mockAiAnalysisRequest(page: Page) {
  await page.route(
    (url) =>
      url.pathname.includes("/api/ai/organizations/") &&
      url.pathname.endsWith("/analysis"),
    (route) =>
      route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({ status: "OK", data: MOCK_TOKEN }),
      }),
  );
}

/** GET /api/ai/reports/{token} 모킹 — SUCCESS 즉시 반환 */
async function mockAiAnalysisResult(page: Page) {
  await page.route(
    (url) => url.pathname.includes("/api/ai/reports/"),
    (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "OK",
          data: {
            accessToken: MOCK_TOKEN,
            status: "SUCCESS",
            result: {
              strategySuggestion:
                "광고 예산을 클릭률이 높은 플랫폼에 집중 배분하세요.",
              performanceSummary:
                "이번 기간 전체 CTR이 전월 대비 12% 상승했습니다.",
              analysisReason: "네이버 광고의 노출 증가가 주요 원인입니다.",
              performancePoint: ["CTR 12% 상승", "전환율 8% 개선"],
              cautionPoint: ["메타 광고 CPC 상승 추세"],
            },
          },
        }),
      }),
  );
}

test.describe("AI 분석 요청 E2E", () => {
  test("통합 AI 요약 카드가 접힌 상태로 렌더된다", async ({
    dashboardPage: page,
  }) => {
    const expandButton = page.getByRole("button", {
      name: `${CARD_TITLE} 펼치기`,
    });
    await expect(expandButton).toBeVisible();
    await expect(expandButton).toHaveAttribute("aria-expanded", "false");
  });

  test("카드를 펼치면 분석이 요청되고 로딩 상태가 표시된다", async ({
    dashboardPage: page,
  }) => {
    await mockAiAnalysisRequest(page);
    // 결과를 PENDING으로 고정해 로딩 상태를 유지
    await page.route(
      (url) => url.pathname.includes("/api/ai/reports/"),
      (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            status: "OK",
            data: { accessToken: MOCK_TOKEN, status: "PENDING", result: null },
          }),
        }),
    );

    await page.getByRole("button", { name: `${CARD_TITLE} 펼치기` }).click();

    await expect(
      page.getByRole("button", { name: `${CARD_TITLE} 접기` }),
    ).toBeVisible();

    await expect(page.getByLabel("AI 요약 로딩")).toBeVisible();
  });

  test("분석 결과가 도착하면 핵심 섹션 세 곳이 렌더된다", async ({
    dashboardPage: page,
  }) => {
    await mockAiAnalysisRequest(page);
    await mockAiAnalysisResult(page);

    await page.getByRole("button", { name: `${CARD_TITLE} 펼치기` }).click();

    await expect(
      page.getByRole("heading", { name: "전략 제안" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "주의가 필요한 부분" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "분석 인사이트" }),
    ).toBeVisible();
  });
});
