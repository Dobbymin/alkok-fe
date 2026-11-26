import type { KoreanSupportLevel, ToolDetailData } from "@alkok/core";

const KOREAN_LABEL: Record<KoreanSupportLevel, string> = {
  FULL: "한국어 완전 지원",
  PARTIAL: "한국어 부분 지원",
  NONE: "한국어 미지원",
};

export function formatCompareSummaryText(
  tools: ToolDetailData[],
  shareUrl: string,
): string {
  if (tools.length === 0) return shareUrl;

  const header = `[알콕 AI 도구 비교] ${tools.map((t) => t.title).join(" vs ")}`;
  const lines = tools.map((tool) => {
    const freeLabel = tool.hasFreePlan ? "무료 플랜 있음" : "유료 전용";
    const strength = tool.strengths[0] ?? tool.summary;
    const verified = tool.verifiedAt ? ` (확인일 ${tool.verifiedAt.slice(0, 10)})` : "";
    return `- ${tool.title} (${tool.providerName}): ${freeLabel} · ${KOREAN_LABEL[tool.koreanSupport]} · ${tool.pricingSummary} · 강점: ${strength}${verified}`;
  });

  return `${header}\n${lines.join("\n")}\n비교표 보기: ${shareUrl}`;
}
