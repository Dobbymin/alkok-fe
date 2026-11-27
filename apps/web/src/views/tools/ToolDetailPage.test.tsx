import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ToolDetailData } from "@alkok/core";
import { TooltipProvider } from "@alkok/ui";
import ToolDetailPage from "./ToolDetailPage";

const MOCK_TOOL: ToolDetailData = {
  id: "tool-1",
  type: "TOOL",
  slug: "claude",
  title: "Claude",
  summary: "긴 문서 독해와 한국어 문체에 강한 AI 어시스턴트",
  publishStatus: "PUBLISHED",
  verificationStatus: "VALID",
  verifiedAt: "2026-11-27T00:00:00.000Z",
  publishedAt: "2026-11-27T00:00:00.000Z",
  sourceType: "OFFICIAL",
  sourceUrl: "https://www.anthropic.com/claude",
  helpfulCount: 10,
  toolKind: "TOOL",
  providerName: "Anthropic",
  officialUrl: "https://www.anthropic.com/claude",
  pricingModel: "FREEMIUM",
  hasFreePlan: true,
  pricingSummary: "무료 플랜 / Pro 월 $20",
  pricingPlans: [
    { name: "Free", price: "$0/월", target: "입문", highlights: "기본 대화" },
    { name: "Pro", price: "$20/월", target: "실무자", highlights: "Projects 제공" },
  ],
  koreanSupport: "FULL",
  platforms: ["Web"],
  strengths: ["자연스러운 한국어"],
  limitations: ["이미지 생성 미지원"],
  useCases: ["계약서 리스크 검토"],
  gettingStartedSteps: [
    { step: 1, title: "Project 생성", description: "참고 문서를 업로드합니다." },
  ],
  examplePrompts: [{ title: "계약서 점검", prompt: "불리한 조항을 찾아줘." }],
  faq: [{ question: "무료로도 되나요?", answer: "네, 기본 대화가 가능합니다." }],
  compatibleSkills: [
    {
      id: "skill-1",
      type: "SKILL",
      slug: "skill-humanize-korean",
      title: "Humanize KR",
      summary: "AI 티 제거 윤문",
      publishStatus: "PUBLISHED",
      verificationStatus: "VALID",
      sourceType: "OFFICIAL",
      sourceUrl: "https://github.com/epoko77-ai/im-not-ai",
      helpfulCount: 5,
      skillKind: "SKILL",
      skillSlug: "humanize-korean",
      authorName: "epoko77-ai",
      repositoryUrl: "https://github.com/epoko77-ai/im-not-ai",
      executionVerification: "SOURCE_CHECKED",
      difficulty: "PRACTICAL",
      pricingModel: "FREE",
      compatibleAgents: ["Claude Code"],
      overview: "윤문 스킬",
      useCases: [],
      beforeAfter: { beforeItems: [], afterItems: [] },
      workflowSteps: [],
      prerequisites: [],
      installGuides: [],
      examplePrompts: [],
      expectedOutputs: [],
      postRunChecklist: [],
      tips: [],
      faq: [],
      fileStructure: [],
    },
  ],
};

describe("ToolDetailPage", () => {
  it("renders pricingPlans table, useCases, gettingStartedSteps, examplePrompts, compatibleSkills, and faq", () => {
    render(
      <TooltipProvider>
        <ToolDetailPage
          tool={MOCK_TOOL}
          bookmarkSlot={<span>bookmark</span>}
          engagementSlot={<span>engagement</span>}
        />
      </TooltipProvider>,
    );

    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByText("$20/월")).toBeInTheDocument();
    expect(screen.getByText("계약서 리스크 검토")).toBeInTheDocument();
    expect(screen.getByText("Project 생성")).toBeInTheDocument();
    expect(screen.getByText("계약서 점검")).toBeInTheDocument();
    expect(screen.getByText("Humanize KR")).toBeInTheDocument();
    expect(screen.getByText("Q. 무료로도 되나요?")).toBeInTheDocument();
  });
});
