import {
  expect,
  loginAndReachDashboard,
  type Page,
  test,
  waitForDashboardReady,
} from "./fixtures/auth";

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

const SHARED_TOKEN = "shared-report-token";

/**
 * /organizations/{orgId}/reports 응답을 지연시킨다.
 * release()를 호출하면 지정한 status의 공유 리포트가 반환된다.
 */
async function setupDelayedSharedReport(
  page: Page,
  reportStatus: "PENDING" | "SUCCESS",
): Promise<{ release: () => void }> {
  let release!: () => void;
  const gate = new Promise<void>((r) => {
    release = r;
  });

  await page.route(
    (url) =>
      url.pathname.includes("/api/ai/organizations/") &&
      url.pathname.endsWith("/reports"),
    async (route) => {
      await gate;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "OK",
          data: {
            hasNext: false,
            nextCursor: null,
            reports: [
              {
                reportId: 1,
                reportAccessToken: SHARED_TOKEN,
                title: "팀 공유 분석",
                status: reportStatus,
                isShared: true,
                createdAt: "2026-08-01T00:00:00Z",
              },
            ],
          },
        }),
      });
    },
  );

  // 공유 토큰 폴링 — PENDING 고정으로 추가 POST 없이 유지
  await page.route(
    (url) =>
      url.pathname.includes("/api/ai/reports/") &&
      !url.pathname.includes("/organizations/"),
    (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "OK",
          data: { accessToken: SHARED_TOKEN, status: "PENDING", result: null },
        }),
      }),
  );

  return { release };
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

test.describe("공유 리포트 fallback 회귀", () => {
  for (const reportStatus of ["PENDING", "SUCCESS"] as const) {
    test(`공유 리포트(${reportStatus}) 조회 중 카드를 펼쳐도 POST를 보내지 않는다`, async ({
      page,
    }) => {
      test.skip(
        !process.env.E2E_USER_EMAIL || !process.env.E2E_USER_PASSWORD,
        "E2E_USER_EMAIL / E2E_USER_PASSWORD 가 .env 에 필요합니다.",
      );

      const { release } = await setupDelayedSharedReport(page, reportStatus);

      let analysisPostCount = 0;
      await page.route(
        (url) =>
          url.pathname.includes("/api/ai/organizations/") &&
          url.pathname.endsWith("/analysis"),
        (route) => {
          analysisPostCount++;
          void route.abort();
        },
      );

      await loginAndReachDashboard(page);
      await waitForDashboardReady(page);

      // 공유 리포트 응답이 아직 오지 않은 상태(isCheckingSharedReport=true)에서 카드를 펼침
      await page.getByRole("button", { name: `${CARD_TITLE} 펼치기` }).click();

      // 이제 공유 리포트 응답을 해제 — 사용 가능한 리포트가 있으므로 POST 없어야 함
      release();

      await page.waitForTimeout(600);

      expect(analysisPostCount).toBe(0);
    });
  }
});
