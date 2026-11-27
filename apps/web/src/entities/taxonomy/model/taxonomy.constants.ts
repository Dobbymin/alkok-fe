import type { DifficultyLevel, SourceType } from "@alkok/core";

export const WORK_DOMAINS = [
  { slug: "docs-reports", name: "문서·보고서" },
  { slug: "meetings-comms", name: "회의·커뮤니케이션" },
  { slug: "research", name: "리서치·정보조사" },
  { slug: "data-sheets", name: "데이터·스프레드시트" },
  { slug: "planning-slides", name: "기획·프레젠테이션" },
  { slug: "content-design", name: "콘텐츠·디자인" },
  { slug: "career", name: "취업·이직" },
] as const;

export const AI_USES = [
  { slug: "writing-summary", name: "글쓰기·요약" },
  { slug: "search-analysis", name: "검색·분석" },
  { slug: "image-video", name: "이미지·영상" },
  { slug: "audio-meetings", name: "음성·회의록" },
  { slug: "automation-workflow", name: "업무 자동화·도구 조합" },
] as const;

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  BEGINNER: "입문",
  PRACTICAL: "실무",
  ADVANCED: "응용",
};

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  OFFICIAL: "공식",
  MEDIA: "전문 미디어",
  COMMUNITY: "커뮤니티",
};

export const POPULAR_SEARCH_CHIPS = [
  "회의록 정리",
  "보고서 초안",
  "PDF 요약",
  "무료 AI 비교",
] as const;

export interface ComparePresetDefinition {
  id: string;
  shortLabel: string;
  label: string;
  purpose: string;
  recommendedSummary: string;
  slugs: readonly string[];
}

export const POPULAR_COMPARE_PRESETS: readonly ComparePresetDefinition[] = [
  {
    id: "free-chatbots",
    shortLabel: "무료 챗봇 3종",
    label: "ChatGPT vs Claude vs Gemini 무료 플랜 비교",
    purpose: "일상 업무·글쓰기용 무료 범용 AI 선택",
    recommendedSummary:
      "멀티모달·음성 대화와 폭넓은 활용은 ChatGPT, 자연스러운 한국어 보고서 문체는 Claude, 구글 워크스페이스 연동과 긴 컨텍스트는 Gemini가 유리합니다.",
    slugs: ["chatgpt", "claude", "gemini"],
  },
  {
    id: "meeting-voice",
    shortLabel: "회의록·음성 AI",
    label: "클로바노트 vs NotebookLM vs Notion AI 회의록 비교",
    purpose: "한국어 회의 녹취·요약·액션아이템 정리",
    recommendedSummary:
      "한국어 음성 인식과 화자 분리는 클로바노트, 녹취록·문서 교차 질문은 NotebookLM, 팀 위키·회의록 데이터베이스 정리는 Notion AI가 강점입니다.",
    slugs: ["clova-note", "notebooklm", "notion-ai"],
  },
  {
    id: "docs-summary",
    shortLabel: "문서·PDF 요약 AI",
    label: "NotebookLM vs Claude vs Notion AI 문서 요약 비교",
    purpose: "긴 PDF·기획서·사내 매뉴얼 핵심 요약",
    recommendedSummary:
      "출처 인용 기반 다중 PDF 분석은 NotebookLM, 긴 보고서 초안 재구성은 Claude, 사내 문서 공간 내 즉시 요약은 Notion AI가 적합합니다.",
    slugs: ["notebooklm", "claude", "notion-ai"],
  },
  {
    id: "research-tools",
    shortLabel: "리서치·출처 검색 AI",
    label: "Perplexity vs NotebookLM vs ChatGPT 리서치 비교",
    purpose: "시장·경쟁사 조사와 출처 검증형 검색",
    recommendedSummary:
      "최신 웹 검색과 원문 링크 확인은 Perplexity, 보유 자료 기반 심층 분석은 NotebookLM, 복합 정리와 초안 작성은 ChatGPT가 효율적입니다.",
    slugs: ["perplexity", "notebooklm", "chatgpt"],
  },
  {
    id: "korean-strength",
    shortLabel: "한국어 강점 AI",
    label: "뤼튼 vs 클로바노트 vs Claude vs DeepL 한국어 비교",
    purpose: "한국어 비즈니스 문서·음성·번역 품질 비교",
    recommendedSummary:
      "무료 한국어 템플릿 접근성은 뤼튼, 한국어 회의 전사는 클로바노트, 격식 있는 보고서 문장은 Claude, 다국어 비즈니스 번역은 DeepL이 강점입니다.",
    slugs: ["wrtn", "clova-note", "claude", "deepl"],
  },
  {
    id: "slides-design",
    shortLabel: "발표·슬라이드 AI",
    label: "Gamma vs Canva Magic Studio vs Microsoft Copilot 발표 비교",
    purpose: "제안서·발표 슬라이드 및 시각 자료 제작",
    recommendedSummary:
      "텍스트 개요에서 빠른 웹·덱 생성은 Gamma, 사내 홍보물·카드뉴스 편집은 Canva Magic Studio, 기존 PPTX 파일 작업은 Microsoft Copilot이 유리합니다.",
    slugs: ["gamma", "canva-magic-studio", "microsoft-copilot"],
  },
  {
    id: "workplace-docs",
    shortLabel: "오피스 문서·협업 AI",
    label: "Notion AI vs Microsoft Copilot 문서 업무 비교",
    purpose: "팀 협업 문서 및 오피스(Word·Excel·PPT) 연동",
    recommendedSummary:
      "노션 기반 지식 베이스와 DB 자동 채우기는 Notion AI, Microsoft 365(Word·Excel·Teams) 중심 기업 환경은 Microsoft Copilot이 적합합니다.",
    slugs: ["notion-ai", "microsoft-copilot"],
  },
] as const;

export function normalizeCompareSlugs(
  raw: string | readonly string[],
  maxCount = 4,
): string[] {
  const tokens = Array.isArray(raw) ? raw : String(raw).split(",");
  const seen = new Set<string>();
  const result: string[] = [];

  for (const token of tokens) {
    const normalized = token.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
    if (result.length >= maxCount) break;
  }

  return result;
}

export function findMatchingComparePreset(
  slugs: readonly string[],
): ComparePresetDefinition | undefined {
  const normalized = normalizeCompareSlugs(slugs);
  if (normalized.length === 0) return undefined;
  const targetSet = new Set(normalized);

  return POPULAR_COMPARE_PRESETS.find((preset) => {
    if (preset.slugs.length !== targetSet.size) return false;
    return preset.slugs.every((slug) => targetSet.has(slug));
  });
}

export function mergeComparisonPresets(
  serverPresets?: ReadonlyArray<{
    id: string;
    label: string;
    slugs: readonly string[];
  }>,
): ComparePresetDefinition[] {
  const byId = new Map<string, ComparePresetDefinition>();
  for (const preset of POPULAR_COMPARE_PRESETS) {
    byId.set(preset.id, preset);
  }

  if (!serverPresets || serverPresets.length === 0) {
    return [...POPULAR_COMPARE_PRESETS];
  }

  const merged: ComparePresetDefinition[] = [];
  const seenIds = new Set<string>();

  for (const srv of serverPresets) {
    const slugs = normalizeCompareSlugs(srv.slugs);
    if (slugs.length === 0) continue;
    const base = byId.get(srv.id);
    seenIds.add(srv.id);
    merged.push({
      id: srv.id,
      shortLabel: srv.label,
      label: srv.label,
      purpose: base?.purpose ?? "실무 비교 프리셋",
      recommendedSummary: base?.recommendedSummary ?? "",
      slugs,
    });
  }

  for (const preset of POPULAR_COMPARE_PRESETS) {
    if (!seenIds.has(preset.id)) {
      merged.push(preset);
    }
  }

  return merged;
}
