import { expect, test } from "@playwright/test";

test.describe("Gate 2: Public Discovery, Quick Search & Tool Compare", () => {
  test("renders public routes and navigates via Quick Search", async ({
    page,
  }) => {
    await page.route("**/api/v1/search/suggest**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            suggestions: [
              {
                id: "g1",
                type: "GUIDE",
                slug: "weekly-report",
                title: "주간 보고서 자동화",
              },
            ],
          },
        }),
      });
    });

    await page.goto("/");
    const sidebar = page.getByRole("complementary", { name: "주 사이드바" });
    await expect(sidebar).toBeVisible();
    await expect(page.locator("main")).toBeVisible();

    const sidebarBox = await sidebar.boundingBox();
    const mainBox = await page.locator("main").boundingBox();
    expect(sidebarBox).not.toBeNull();
    expect(mainBox).not.toBeNull();
    if (sidebarBox && mainBox) {
      expect(mainBox.x).toBeGreaterThanOrEqual(sidebarBox.x + sidebarBox.width - 1);
    }

    await page.goto("/guides");
    await expect(page.locator("h1")).toContainText("업무 활용 가이드");

    await page.goto("/tools");
    await expect(page.locator("h1")).toContainText("AI 도구");

    await page.goto("/news");
    await expect(page.locator("h1")).toContainText("AI 소식");

    // Open Quick Search via button and submit query
    await page.getByRole("button", { name: /빠른 검색/ }).first().click();
    const input = page.getByLabel("검색어 입력");
    await expect(input).toBeVisible();
    await input.fill("보고서");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/search\?q=/);
  });

  test("renders tool compare page", async ({ page }) => {
    await page.goto("/tools/compare?slugs=chatgpt,claude");
    await expect(page.locator("h1")).toContainText("비교");
  });

  test("defaults to light mode even under OS dark scheme and toggles dark mode only on click", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();

    await page.goto("/");
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/\bdark\b/);

    const toggle = page.getByRole("button", { name: "테마 전환" }).first();
    await toggle.click();
    await expect(html).toHaveClass(/\bdark\b/);

    await toggle.click();
    await expect(html).not.toHaveClass(/\bdark\b/);

    await context.close();
  });
});
