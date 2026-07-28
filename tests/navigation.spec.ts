import { expandSidebarIfCollapsed, expect, test } from "./fixtures/auth";

test.describe("로그인 후 사이드바 네비게이션", () => {
  test("통합 대시보드 화면을 확인한다", async ({ dashboardPage: page }) => {
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
  });
});
