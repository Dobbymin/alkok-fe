import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { GuideDetailData } from "@alkok/core";
import { TooltipProvider } from "@alkok/ui";
import GuideDetailPage from "./GuideDetailPage";

const MOCK_GUIDE: GuideDetailData = {
  id: "guide-1",
  type: "GUIDE",
  slug: "guide-weekly-report",
  title: "주간 보고서 10분 완성 가이드",
  summary: "메모를 구조화된 보고서로 바꿉니다.",
  publishStatus: "PUBLISHED",
  verificationStatus: "VALID",
  verifiedAt: "2026-11-27T00:00:00.000Z",
  publishedAt: "2026-11-27T00:00:00.000Z",
  sourceType: "OFFICIAL",
  sourceUrl: "https://example.com/guide",
  helpfulCount: 2,
  difficulty: "BEGINNER",
  estimatedMinutes: 10,
  pricingModel: "FREEMIUM",
  markdownBody: "## 1. 준비\n메모를 모읍니다.",
  prompts: [
    {
      id: "p1",
      title: "보고서 프롬프트",
      content: "{{메모}}를 요약하세요.",
      variables: ["메모"],
      variableExamples: { 메모: "CS 10건 처리" },
      expectedOutput: "개조식 보고서",
      tips: "실명 제외",
    },
  ],
  beforeAfterExamples: [
    {
      id: "ba1",
      title: "메모 변환 예시",
      beforeInput: "오늘 고객 미팅함",
      afterOutput: "성과: 고객 미팅 완료",
      improvementPoints: ["개조식 구조화"],
    },
  ],
  commonMistakes: [
    {
      id: "cm1",
      category: "SECURITY",
      title: "고객 실명 입력",
      mistake: "실명을 그대로 입력함",
      prevention: "A사 형태로 마스킹함",
    },
  ],
  verificationChecklist: ["원본 수치 일치 여부 확인"],
  cautions: "대외비 제외",
};

describe("GuideDetailPage", () => {
  it("renders before/after examples, common mistakes, and verification checklist", () => {
    render(
      <TooltipProvider>
        <GuideDetailPage
          guide={MOCK_GUIDE}
          bookmarkSlot={<span>bookmark</span>}
          engagementSlot={<span>engagement</span>}
        />
      </TooltipProvider>,
    );

    expect(screen.getByText("메모 변환 예시")).toBeInTheDocument();
    expect(screen.getByText("오늘 고객 미팅함")).toBeInTheDocument();
    expect(screen.getByText("개조식 구조화")).toBeInTheDocument();
    expect(screen.getByText("보안 주의")).toBeInTheDocument();
    expect(screen.getByText("고객 실명 입력")).toBeInTheDocument();
    expect(screen.getByText("원본 수치 일치 여부 확인")).toBeInTheDocument();
  });
});
