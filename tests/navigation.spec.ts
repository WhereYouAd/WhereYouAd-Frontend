import { expect, type Page, test } from "@playwright/test";

const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;

async function loginAndReachDashboard(page: Page) {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();

  await page.getByPlaceholder("이메일을 입력하세요").fill(email!);
  await page.getByPlaceholder("비밀번호를 입력하세요").fill(password!);
  await page.getByRole("button", { name: "로그인하기" }).click();

  await expect(page).toHaveURL(/\/dashboard/);
}

async function expandSidebarIfCollapsed(page: Page) {
  const expandSidebar = page.getByRole("button", { name: "사이드바 펼치기" });
  if (await expandSidebar.isVisible()) {
    await expandSidebar.click();
  }
}

test.describe("로그인 후 사이드바 네비게이션", () => {
  test.beforeEach(() => {
    test.skip(
      !email || !password,
      "E2E_USER_EMAIL / E2E_USER_PASSWORD 가 .env 에 필요합니다.",
    );
  });

  test("통합 대시보드 화면을 확인한다", async ({ page }) => {
    await loginAndReachDashboard(page);
    await expandSidebarIfCollapsed(page);

    const nav = page.getByRole("navigation", {
      name: "사이드바 내비게이션",
    });

    // 로그인 후 /dashboard 진입 시 대시보드 하위 메뉴가 이미 펼쳐짐
    await expect(
      nav.getByRole("link", { name: "통합 대시보드", exact: true }),
    ).toBeVisible();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText("실시간 트래픽 변화")).toBeVisible();

    const header = page.locator("main header");
    await expect(
      header.getByRole("link", { name: "대시보드", exact: true }),
    ).toBeVisible();
    await expect(
      header.getByRole("link", { name: "통합 대시보드", exact: true }),
    ).toBeVisible();

    const aiSummary = page.getByRole("button", { name: "AI 요약하기" });
    if (await aiSummary.isVisible()) {
      await expect(aiSummary).toBeVisible();
    }
  });
});
