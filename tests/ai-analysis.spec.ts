import { expect, test } from "./fixtures/auth";

const CARD_TITLE = "통합 광고 성과 AI 요약";

// AI 폴링 최대 90초 + 여유 30초
const AI_ANALYSIS_TIMEOUT = 120_000;

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

  test("카드를 펼치면 분석이 요청되고 결과 또는 에러가 표시된다", async ({
    dashboardPage: page,
  }) => {
    test.setTimeout(AI_ANALYSIS_TIMEOUT);

    const expandButton = page.getByRole("button", {
      name: `${CARD_TITLE} 펼치기`,
    });
    await expandButton.click();

    // 카드가 펼쳐진 상태로 전환
    await expect(
      page.getByRole("button", { name: `${CARD_TITLE} 접기` }),
    ).toBeVisible();

    // 로딩 skeleton 또는 loadingMessage 중 하나 확인
    const loadingSkeleton = page.getByLabel("AI 요약 로딩");
    const loadingText = page.getByText("분석을 요청하고 있어요");
    const hasLoading =
      (await loadingSkeleton.isVisible()) || (await loadingText.isVisible());
    expect(hasLoading).toBe(true);

    // 로딩 종료 대기 — 결과 섹션 또는 에러 메시지 중 하나가 나타날 때까지
    const resultSection = page.getByRole("heading", { name: "전략 제안" });
    const errorMessage = page.getByText("잠시 후 다시 시도해 주세요");

    await expect(resultSection.or(errorMessage)).toBeVisible({
      timeout: AI_ANALYSIS_TIMEOUT,
    });
  });

  test("분석 결과가 표시되면 핵심 섹션 세 곳이 모두 렌더된다", async ({
    dashboardPage: page,
  }) => {
    test.setTimeout(AI_ANALYSIS_TIMEOUT);

    const expandButton = page.getByRole("button", {
      name: `${CARD_TITLE} 펼치기`,
    });
    await expandButton.click();

    const resultSection = page.getByRole("heading", { name: "전략 제안" });
    const errorMessage = page.getByText("잠시 후 다시 시도해 주세요");

    await expect(resultSection.or(errorMessage)).toBeVisible({
      timeout: AI_ANALYSIS_TIMEOUT,
    });

    // 성공 케이스에서만 세 섹션 전체 확인
    if (await resultSection.isVisible()) {
      await expect(
        page.getByRole("heading", { name: "주의가 필요한 부분" }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "분석 인사이트" }),
      ).toBeVisible();
    }
  });
});
