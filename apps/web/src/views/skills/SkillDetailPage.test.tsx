import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { SkillDetailData } from "@alkok/core";
import { TooltipProvider } from "@alkok/ui";
import SkillDetailPage from "./SkillDetailPage";

const MOCK_SKILL: SkillDetailData = {
  id: "skill-1",
  type: "SKILL",
  slug: "skill-humanize-korean",
  title: "Humanize KR (AI 글 사람처럼 윤문하기)",
  summary: "AI 티를 제거하고 자연스러운 한국어로 윤문합니다.",
  publishStatus: "PUBLISHED",
  verificationStatus: "VALID",
  verifiedAt: "2026-11-27T00:00:00.000Z",
  publishedAt: "2026-11-27T00:00:00.000Z",
  sourceType: "OFFICIAL",
  sourceUrl: "https://github.com/epoko77-ai/im-not-ai",
  sourceName: "epoko77-ai",
  helpfulCount: 5,
  skillKind: "SKILL",
  skillSlug: "humanize-korean",
  authorName: "epoko77-ai",
  license: "MIT",
  repositoryUrl: "https://github.com/epoko77-ai/im-not-ai",
  executionVerification: "SOURCE_CHECKED",
  difficulty: "PRACTICAL",
  pricingModel: "FREE",
  compatibleAgents: ["Claude Code", "Codex"],
  overview: "번역투와 기계적 대구를 교정하는 윤문 스킬입니다.",
  useCases: ["블로그 글 AI 티 제거"],
  beforeAfter: {
    beforeItems: ["딱 봐도 AI 같다"],
    afterItems: ["자연스러운 한국어 리듬"],
  },
  workflowSteps: [
    { step: 1, title: "점수 측정", description: "패턴 밀도를 계산합니다.", badge: "Python" },
  ],
  prerequisites: [
    { name: "스킬 지원 에이전트", required: true, description: "Claude Code 등" },
  ],
  installPrompt: "이 스킬을 설치해줘.",
  installGuides: [
    {
      environment: "claude-code",
      label: "Claude Code",
      steps: ["~/.claude/skills/에 복사합니다."],
      invokeExample: "/humanize-korean",
    },
  ],
  examplePrompts: [{ label: "기본 윤문", prompt: "AI 티 없애줘" }],
  expectedOutputs: [{ order: "01", title: "윤문본", description: "자연스러운 본문" }],
  postRunChecklist: ["숫자 보존 확인"],
  tips: ["먼저 진단으로 시작하세요."],
  cautions: "AI 탐지기 100% 우회 도구는 아닙니다.",
  faq: [{ question: "내용이 바뀌나요?", answer: "숫자와 핵심어는 보존됩니다." }],
  fileStructure: ["SKILL.md", "scripts/verify_gates.py"],
  skillMdPreview: Array.from({ length: 30 }, (_, i) => `line ${i + 1}`).join("\n"),
  webAlternative: {
    title: "설치 없이 Claude Projects로 따라 하기",
    description: "맞춤 지침에 윤문 규칙을 저장해 쓰세요.",
    recommendedTools: ["claude"],
  },
};

describe("SkillDetailPage", () => {
  it("renders all structured skill sections and toggles 25-line SKILL.md preview", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <SkillDetailPage
          skill={MOCK_SKILL}
          bookmarkSlot={<span>bookmark</span>}
          engagementSlot={<span>engagement</span>}
        />
      </TooltipProvider>,
    );

    expect(screen.getByText("Humanize KR (AI 글 사람처럼 윤문하기)")).toBeInTheDocument();
    expect(screen.getByText("원본 SKILL.md 확인")).toBeInTheDocument();
    expect(screen.getByText("딱 봐도 AI 같다")).toBeInTheDocument();
    expect(screen.getByText("자연스러운 한국어 리듬")).toBeInTheDocument();
    expect(screen.getByText("점수 측정")).toBeInTheDocument();
    expect(screen.getByText("설치 없이 Claude Projects로 따라 하기")).toBeInTheDocument();
    expect(screen.getByText("Q. 내용이 바뀌나요?")).toBeInTheDocument();

    const expandBtn = screen.getByRole("button", { name: /전체 보기 \(30줄\)/ });
    await user.click(expandBtn);
    expect(screen.getByRole("button", { name: /접기/ })).toBeInTheDocument();
  });
});
