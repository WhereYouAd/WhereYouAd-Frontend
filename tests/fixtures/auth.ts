import { type Page, test as base } from "@playwright/test";

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

export async function expandSidebarIfCollapsed(page: Page) {
  const expandSidebar = page.getByRole("button", { name: "사이드바 펼치기" });
  if (await expandSidebar.isVisible()) {
    await expandSidebar.click();
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
    await use(page);
  },
});

export { expect } from "@playwright/test";
