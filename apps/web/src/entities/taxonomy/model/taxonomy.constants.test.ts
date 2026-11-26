import { describe, expect, it } from "vitest";
import {
  findMatchingComparePreset,
  mergeComparisonPresets,
  normalizeCompareSlugs,
  POPULAR_COMPARE_PRESETS,
} from "./taxonomy.constants";

const KNOWN_SEEDED_TOOL_SLUGS = new Set([
  "chatgpt",
  "claude",
  "gemini",
  "perplexity",
  "microsoft-copilot",
  "notion-ai",
  "notebooklm",
  "clova-note",
  "deepl",
  "gamma",
  "canva-magic-studio",
  "zapier",
  "make",
  "n8n",
  "cursor",
  "wrtn",
  "adobe-firefly",
  "runway",
  "elevenlabs",
  "figma-ai",
]);

describe("taxonomy compare presets", () => {
  it("defines at least 6 business-purpose presets with valid seeded slugs", () => {
    expect(POPULAR_COMPARE_PRESETS.length).toBeGreaterThanOrEqual(6);
    for (const preset of POPULAR_COMPARE_PRESETS) {
      expect(preset.slugs.length).toBeGreaterThanOrEqual(2);
      expect(preset.slugs.length).toBeLessThanOrEqual(4);
      for (const slug of preset.slugs) {
        expect(KNOWN_SEEDED_TOOL_SLUGS.has(slug)).toBe(true);
      }
    }
  });

  it("normalizes, deduplicates, and caps compare slugs at 4", () => {
    expect(
      normalizeCompareSlugs("ChatGPT, claude, chatgpt, gemini, perplexity, wrtn"),
    ).toEqual(["chatgpt", "claude", "gemini", "perplexity"]);
  });

  it("matches presets regardless of slug order and merges server presets cleanly", () => {
    const matched = findMatchingComparePreset(["gemini", "chatgpt", "claude"]);
    expect(matched?.id).toBe("free-chatbots");

    const merged = mergeComparisonPresets([
      {
        id: "free-chatbots",
        label: "서버 무료 챗봇 비교",
        slugs: ["chatgpt", "claude", "gemini"],
      },
    ]);
    expect(merged[0]?.shortLabel).toBe("서버 무료 챗봇 비교");
    expect(merged.length).toBe(POPULAR_COMPARE_PRESETS.length);
  });
});
