import type { DifficultyLevel, SourceType } from "@alkok/core";

export const WORK_DOMAINS = [
  { slug: "docs-reports", name: "문서·보고서" },
  { slug: "meetings-comms", name: "회의·커뮤니케이션" },
  { slug: "research", name: "리서치·정보조사" },
  { slug: "data-sheets", name: "데이터·스프레드시트" },
  { slug: "planning-slides", name: "기획·프레젠테이션" },
  { slug: "content-design", name: "콘텐츠·디자인" },
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

export const POPULAR_COMPARE_PRESETS = [
  {
    label: "ChatGPT vs Claude vs Gemini 무료 플랜 비교",
    slugs: ["chatgpt", "claude", "gemini"],
  },
  {
    label: "Perplexity vs ChatGPT Search 리서치 비교",
    slugs: ["perplexity", "chatgpt"],
  },
  {
    label: "Notion AI vs Claude 문서 요약 비교",
    slugs: ["notion-ai", "claude"],
  },
] as const;
