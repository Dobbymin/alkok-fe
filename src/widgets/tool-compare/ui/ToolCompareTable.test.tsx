import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { compareStore } from "@/features/tool-compare";
import type { ToolDetailData } from "@/shared/types";
import { TooltipProvider } from "@/shared/ui";
import { ToolCompareTable } from "./ToolCompareTable";

const sampleTools: ToolDetailData[] = [
  {
    id: "t1",
    type: "TOOL",
    slug: "chatgpt",
    title: "ChatGPT",
    summary: "범용 AI 어시스턴트",
    publishStatus: "PUBLISHED",
    verificationStatus: "VALID",
    verifiedAt: "2026-11-20T00:00:00.000Z",
    sourceType: "OFFICIAL",
    sourceUrl: "https://chatgpt.com",
    helpfulCount: 10,
    toolKind: "TOOL",
    providerName: "OpenAI",
    officialUrl: "https://chatgpt.com",
    pricingModel: "FREEMIUM",
    hasFreePlan: true,
    pricingSummary: "무료 플랜 / Plus 월 $20",
    koreanSupport: "FULL",
    platforms: ["Web", "iOS"],
    strengths: ["대화 품질 우수"],
    limitations: ["무료 사용량 제한"],
    isAffiliate: true,
  },
  {
    id: "t2",
    type: "TOOL",
    slug: "claude",
    title: "Claude",
    summary: "문서 분석 특화 AI",
    publishStatus: "PUBLISHED",
    verificationStatus: "VALID",
    verifiedAt: "2026-11-20T00:00:00.000Z",
    sourceType: "OFFICIAL",
    sourceUrl: "https://claude.ai",
    helpfulCount: 8,
    toolKind: "TOOL",
    providerName: "Anthropic",
    officialUrl: "https://claude.ai",
    pricingModel: "FREEMIUM",
    hasFreePlan: true,
    pricingSummary: "무료 플랜 / Pro 월 $20",
    koreanSupport: "FULL",
    platforms: ["Web", "iOS"],
    strengths: ["긴 문서 요약 탁월"],
    limitations: ["이미지 생성 미지원"],
  },
];

describe("ToolCompareTable & compareStore", () => {
  beforeEach(() => {
    compareStore.clear();
  });

  it("renders 7 comparison axes and filters identical rows with 차이점만 보기", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <ToolCompareTable tools={sampleTools} />
      </TooltipProvider>,
    );

    expect(screen.getAllByText("유형 · 제공사").length).toBeGreaterThan(0);
    expect(screen.getAllByText("한국어 지원").length).toBeGreaterThan(0);
    expect(screen.getAllByText("제휴 링크").length).toBeGreaterThan(0);

    await user.click(screen.getByLabelText("차이점만 보기"));

    // Both have koreanSupport: "FULL" and platforms: ["Web", "iOS"], so those rows are hidden
    expect(screen.queryByText("한국어 지원")).not.toBeInTheDocument();
    expect(screen.getAllByText("강점 · 적합 업무").length).toBeGreaterThan(0);
  });

  it("enforces max 4 items on desktop and max 3 items on mobile", () => {
    expect(compareStore.toggle({ slug: "a", title: "A" }, true)).toBe(true);
    expect(compareStore.toggle({ slug: "b", title: "B" }, true)).toBe(true);
    expect(compareStore.toggle({ slug: "c", title: "C" }, true)).toBe(true);
    expect(compareStore.toggle({ slug: "d", title: "D" }, true)).toBe(false);

    expect(compareStore.toggle({ slug: "d", title: "D" }, false)).toBe(true);
    expect(compareStore.toggle({ slug: "e", title: "E" }, false)).toBe(false);
  });
});
