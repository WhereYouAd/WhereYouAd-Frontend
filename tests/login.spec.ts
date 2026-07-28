import { expandSidebarIfCollapsed, expect, test } from "./fixtures/auth";

test.describe("로그인 E2E", () => {
  test("이메일 로그인 후 대시보드에 머문다", async ({
    dashboardPage: page,
  }) => {
    await expandSidebarIfCollapsed(page);

    const nav = page.getByRole("navigation", { name: "사이드바 내비게이션" });
    await expect(
      nav.getByRole("link", { name: "통합 대시보드", exact: true }),
    ).toBeVisible();

    await expect(
      page.getByText("로그인에 실패했습니다.", { exact: true }),
    ).not.toBeVisible();
  });
});
