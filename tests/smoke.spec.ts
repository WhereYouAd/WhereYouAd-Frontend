import { expect, test } from "@playwright/test";

// 로그인 없이 확인 가능한 최소 스모크
test("로그인 페이지가 열린다", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
});
