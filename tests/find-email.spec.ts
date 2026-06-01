import { expect, test } from "@playwright/test";

test.describe("이메일 찾기 UI", () => {
  test("로그인에서 이메일 찾기(휴대폰 인증) 화면으로 진입한다", async ({
    page,
  }) => {
    await page.goto("/login");

    await page
      .getByRole("link", { name: "이메일/비밀번호를 잊어버렸어요" })
      .click();

    await expect(page).toHaveURL(/\/find-email/);

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading.getByText("이메일 찾기를 위해")).toBeVisible();
    await expect(heading.getByText("휴대폰 인증을 진행할게요")).toBeVisible();

    await expect(page.getByPlaceholder("전화번호를 입력하세요")).toBeVisible();
  });
});
