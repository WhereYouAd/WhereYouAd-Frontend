import { expect, test } from "@playwright/test";

const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;

test.describe("로그인 E2E", () => {
  test.beforeEach(() => {
    test.skip(
      !email || !password,
      "E2E_USER_EMAIL / E2E_USER_PASSWORD 가 .env 에 필요합니다.",
    );
  });

  test("이메일 로그인 후 대시보드에 머문다", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();

    await page.getByPlaceholder("이메일을 입력하세요").fill(email!);
    await page.getByPlaceholder("비밀번호를 입력하세요").fill(password!);
    await page.getByRole("button", { name: "로그인하기" }).click();

    await expect(page).toHaveURL(/\/dashboard/);

    const sidebar = page.getByRole("navigation", {
      name: "사이드바 내비게이션",
    });
    const expandSidebar = page.getByRole("button", { name: "사이드바 펼치기" });
    if (await expandSidebar.isVisible()) {
      await expandSidebar.click();
    }
    await expect(sidebar.getByText("대시보드", { exact: true })).toBeVisible();

    await expect(
      page.getByText("로그인에 실패했습니다.", { exact: true }),
    ).not.toBeVisible();

    const aiSummary = page.getByRole("button", { name: "AI 요약하기" });
    if (await aiSummary.isVisible()) {
      await expect(aiSummary).toBeVisible();
    }
  });
});
