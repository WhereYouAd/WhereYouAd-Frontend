import { expect, test } from "@playwright/test";

// 기본 격리 컨텍스트(쿠키·스토리지 없음) = 비로그인
test.describe("AuthGuard", () => {
  test("비로그인 시 /dashboard 접근은 /login 으로 리다이렉트된다", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
  });
});
