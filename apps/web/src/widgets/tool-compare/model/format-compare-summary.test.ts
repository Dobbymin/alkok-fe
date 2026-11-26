import { describe, expect, it } from "vitest";
import type { ToolDetailData } from "@alkok/core";
import { formatCompareSummaryText } from "./format-compare-summary";

const mockTools: ToolDetailData[] = [
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
    strengths: ["한국어 보고서 문체 우수"],
    limitations: ["무료 한도 제한"],
  },
];

describe("formatCompareSummaryText", () => {
  it("formats concise Korean summary text with tool specs and share URL", () => {
    const out = formatCompareSummaryText(
      mockTools,
      "https://alkok.kr/tools/compare?slugs=chatgpt,claude",
    );
    expect(out).toContain("[알콕 AI 도구 비교] ChatGPT vs Claude");
    expect(out).toContain("ChatGPT (OpenAI): 무료 플랜 있음 · 한국어 완전 지원");
    expect(out).toContain("확인일 2026-11-25");
    expect(out).toContain("https://alkok.kr/tools/compare?slugs=chatgpt,claude");
  });
});
