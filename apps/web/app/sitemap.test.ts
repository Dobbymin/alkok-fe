// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ApiEnvelope, ContentSummary } from "@alkok/core";
import { serverApiGet } from "@alkok/core/server";
import sitemap from "./sitemap";

vi.mock("@alkok/core/server", () => ({
  serverApiGet: vi.fn(),
}));

function makeItem(id: string, slug: string, publishStatus: ContentSummary["publishStatus"] = "PUBLISHED"): ContentSummary {
  return {
    id,
    type: "GUIDE",
    slug,
    title: slug,
    summary: "summary",
    publishStatus,
    verificationStatus: "VALID",
    sourceType: "OFFICIAL",
    sourceUrl: "https://alkok.dobbymin.cloud",
    helpfulCount: 0,
    updatedAt: "2026-11-27T00:00:00.000Z",
  };
}

describe("sitemap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches pages 2..N in parallel using meta.totalPages and filters PUBLISHED items", async () => {
    let resolvePage2!: (value: ApiEnvelope<ContentSummary[]>) => void;
    let resolvePage3!: (value: ApiEnvelope<ContentSummary[]>) => void;
    const page2Promise = new Promise<ApiEnvelope<ContentSummary[]>>((resolve) => {
      resolvePage2 = resolve;
    });
    const page3Promise = new Promise<ApiEnvelope<ContentSummary[]>>((resolve) => {
      resolvePage3 = resolve;
    });

    const mockedGet = vi.mocked(serverApiGet);
    mockedGet.mockImplementation((endpoint, options) => {
      if (endpoint !== "/api/v1/guides") {
        return Promise.resolve({ data: [] });
      }
      const page = options?.params?.page;
      if (page === 1) {
        return Promise.resolve({
          data: [makeItem("g1", "guide-1"), makeItem("g-draft", "draft-1", "DRAFT")],
          meta: { page: 1, limit: 50, total: 120, totalPages: 3, hasNext: true },
        });
      }
      if (page === 2) return page2Promise;
      if (page === 3) return page3Promise;
      return Promise.resolve({ data: [] });
    });

    const sitemapPromise = sitemap();

    // Flush microtasks so page 1 resolves and pages 2 & 3 start concurrently
    await vi.waitFor(() => {
      const guideCalls = mockedGet.mock.calls.filter(([ep]) => ep === "/api/v1/guides");
      expect(guideCalls.map(([, opts]) => opts?.params?.page)).toEqual([1, 2, 3]);
    });

    resolvePage2({ data: [makeItem("g2", "guide-2")] });
    resolvePage3({ data: [makeItem("g3", "guide-3")] });

    const entries = await sitemapPromise;
    const urls = entries.map((e) => e.url);

    expect(urls.some((u) => u.endsWith("/guides/guide-1"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/guides/guide-2"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/guides/guide-3"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/guides/draft-1"))).toBe(false);
  });
});
