import { expect, test } from "@playwright/test";

test.describe("Gate 4: Mobile 390x844 Layout, PWA Assets & A11y", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("bottom tab bar pinned at bottom, 0 horizontal overflow, and 0 console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      pageErrors.push(err.message);
    });

    await page.route("**/api/v1/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [] }),
      });
    });

    for (const path of ["/", "/guides", "/tools", "/news", "/search"]) {
      await page.goto(path);
      await expect(page.locator("main")).toBeVisible();

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1,
      );
      expect(overflow, `Horizontal overflow on ${path}`).toBe(false);

      const bottomNav = page.getByRole("navigation", { name: "모바일 하단 탭" });
      await expect(bottomNav).toBeVisible();
      const box = await bottomNav.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.height).toBeLessThanOrEqual(80);
        expect(box.y).toBeGreaterThan(700);
        expect(box.y + box.height).toBeLessThanOrEqual(846);
      }
    }

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test("serves manifest.webmanifest, sw.js, and brand icons with HTTP 200", async ({
    request,
  }) => {
    const manifestRes = await request.get("/manifest.webmanifest");
    expect(manifestRes.status()).toBe(200);
    const manifestJson = (await manifestRes.json()) as {
      name?: string;
      icons?: Array<{ src: string }>;
    };
    expect(manifestJson.name).toContain("알콕");
    expect((manifestJson.icons ?? []).length).toBeGreaterThanOrEqual(3);

    const swRes = await request.get("/sw.js");
    expect(swRes.status()).toBe(200);

    const iconRes = await request.get("/icons/icon-192.png");
    expect(iconRes.status()).toBe(200);
  });
});
