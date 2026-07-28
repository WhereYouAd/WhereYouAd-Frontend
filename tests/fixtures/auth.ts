import { expect, type Page, test as base } from "@playwright/test";

const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;

export async function loginAndReachDashboard(page: Page) {
  await page.goto("/login");
  await page.getByRole("heading", { name: "로그인" }).waitFor();

  await page.getByPlaceholder("이메일을 입력하세요").fill(email!);
  await page.getByPlaceholder("비밀번호를 입력하세요").fill(password!);
  await page.getByRole("button", { name: "로그인하기" }).click();

  await page.waitForURL(/\/dashboard/);
}

/** 대시보드 콘텐츠 + 워크스페이스 자동 선택 완료까지 대기 */
export async function waitForDashboardReady(page: Page) {
  await expect(page.getByText("실시간 트래픽 변화")).toBeVisible();
}

/** 사이드바가 접혀 있으면 펼친다. click()으로 버튼 존재 여부를 대기 포함해 확인 */
export async function expandSidebarIfCollapsed(page: Page) {
  const expandButton = page.getByRole("button", { name: "사이드바 펼치기" });
  try {
    await expandButton.click({ timeout: 3_000 });
  } catch {
    // 버튼이 없으면 사이드바가 이미 펼쳐진 상태
  }
}

type TAuthFixtures = {
  dashboardPage: Page;
};

export const test = base.extend<TAuthFixtures>({
  dashboardPage: async ({ page }, use) => {
    base.skip(
      !email || !password,
      "E2E_USER_EMAIL / E2E_USER_PASSWORD 가 .env 에 필요합니다.",
    );
    await loginAndReachDashboard(page);
    await waitForDashboardReady(page);
    await use(page);
  },
});

export { expect, type Page } from "@playwright/test";
