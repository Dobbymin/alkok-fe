// @vitest-environment node
import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";

vi.mock("@alkok/core/server", () => ({
  serverApiGet: vi.fn().mockResolvedValue({
    data: [
      {
        id: "t1",
        type: "TOOL",
        slug: "chatgpt",
        title: "ChatGPT",
        summary: "범용 AI",
        publishStatus: "PUBLISHED",
        verificationStatus: "VALID",
        verifiedAt: "2026-11-25T00:00:00.000Z",
        sourceType: "OFFICIAL",
        sourceUrl: "https://chatgpt.com",
        helpfulCount: 0,
        toolKind: "TOOL",
        providerName: "OpenAI",
        officialUrl: "https://chatgpt.com",
        pricingModel: "FREEMIUM",
        hasFreePlan: true,
        pricingSummary: "무료 / Plus $20",
        koreanSupport: "FULL",
        platforms: ["Web"],
        strengths: ["대화 품질 우수"],
        limitations: ["사용량 제한"],
      },
      {
        id: "t2",
        type: "TOOL",
        slug: "claude",
        title: "Claude",
        summary: "문서 AI",
        publishStatus: "PUBLISHED",
        verificationStatus: "VALID",
        verifiedAt: "2026-11-25T00:00:00.000Z",
        sourceType: "OFFICIAL",
        sourceUrl: "https://claude.ai",
        helpfulCount: 0,
        toolKind: "TOOL",
        providerName: "Anthropic",
        officialUrl: "https://claude.ai",
        pricingModel: "FREEMIUM",
        hasFreePlan: true,
        pricingSummary: "무료 / Pro $20",
        koreanSupport: "FULL",
        platforms: ["Web"],
        strengths: ["한국어 문체 우수"],
        limitations: ["무료 한도 제한"],
      },
    ],
  }),
}));

vi.mock("./og-font", () => ({
  loadKoreanOgFonts: vi.fn().mockResolvedValue([]),
}));

describe("GET /api/og/compare", () => {
  it("renders a valid PNG image response with cache headers", async () => {
    const req = new NextRequest(
      "https://alkok.kr/api/og/compare?slugs=chatgpt,claude",
    );
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("image/png");
    expect(res.headers.get("cache-control")).toContain("s-maxage=86400");

    const bytes = new Uint8Array(await res.arrayBuffer());
    expect(bytes.length).toBeGreaterThan(100);
    // PNG magic bytes: 0x89 0x50 0x4E 0x47
    expect(Array.from(bytes.slice(0, 4))).toEqual([0x89, 0x50, 0x4e, 0x47]);
  });
});
