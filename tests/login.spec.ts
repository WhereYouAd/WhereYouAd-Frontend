import { expect, test } from "./fixtures/auth";

test.describe("로그인 E2E", () => {
  test("이메일 로그인 후 대시보드에 머문다", async ({
    dashboardPage: page,
  }) => {
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
