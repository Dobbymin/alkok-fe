import { expect, test } from "@playwright/test";

test.describe("Gate 3: Auth & Personal Vault Flow", () => {
  test("redirects guest from /vault to /login?next=/vault", async ({ page }) => {
    await page.goto("/vault");
    await expect(page).toHaveURL(/\/login\?next=(\/|%2F)vault/);
    await expect(page.getByRole("button", { name: "로그인" })).toBeVisible();
  });

  test("logs in with mocked API and manages external URL in /vault", async ({
    page,
  }) => {
    await page.route("**/api/v1/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            accessToken: "mock-jwt-token",
            user: {
              id: "u1",
              email: "user@example.com",
              nickname: "알콕테스터",
              role: "USER",
              status: "ACTIVE",
              interestCategorySlugs: ["report"],
            },
          },
        }),
      });
    });

    await page.route("**/api/v1/vault/folders", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [{ id: "f1", name: "리서치" }] }),
      });
    });

    await page.route("**/api/v1/vault/tags", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [] }),
      });
    });

    await page.route("**/api/v1/vault/items**", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: [] }),
        });
        return;
      }
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            id: "v1",
            itemType: "EXTERNAL_URL",
            externalUrl: "https://example.com/ai",
            title: "수동 입력 아티클",
            tags: [],
            createdAt: "2026-11-24T00:00:00.000Z",
          },
        }),
      });
    });

    await page.route("**/api/v1/vault/preview-url", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            url: "https://example.com/ai",
            fallback: true,
          },
        }),
      });
    });

    await page.goto("/login?next=/vault");
    await page.getByLabel(/이메일/).fill("user@example.com");
    await page.getByLabel(/비밀번호/).fill("Secret123!");
    await page.getByRole("button", { name: "로그인" }).click();

    await expect(page).toHaveURL(/\/vault/);
    await expect(page.getByRole("heading", { name: "내 보관함" })).toBeVisible();

    await page.getByRole("button", { name: "외부 URL 추가" }).click();
    await page.getByLabel(/URL/).fill("https://example.com/ai");
    await page.getByRole("button", { name: "미리보기" }).click();
    await expect(
      page.getByText(/메타데이터를 자동으로 가져오지 못했습니다/),
    ).toBeVisible();
  });
});
