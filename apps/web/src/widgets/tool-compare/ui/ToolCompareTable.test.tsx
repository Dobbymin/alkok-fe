import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetCompareStore, useCompareStore } from "@/features/tool-compare";
import type { ToolDetailData } from "@alkok/core";
import { TooltipProvider } from "@alkok/ui";
import { ToolComparePageSkeleton } from "./ToolComparePageSkeleton";
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

describe("ToolCompareTable & useCompareStore", () => {
  beforeEach(() => {
    resetCompareStore();
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
    const { toggle } = useCompareStore.getState();
    expect(toggle({ slug: "a", title: "A" }, true)).toBe(true);
    expect(toggle({ slug: "b", title: "B" }, true)).toBe(true);
    expect(toggle({ slug: "c", title: "C" }, true)).toBe(true);
    expect(toggle({ slug: "d", title: "D" }, true)).toBe(false);

    expect(toggle({ slug: "d", title: "D" }, false)).toBe(true);
    expect(toggle({ slug: "e", title: "E" }, false)).toBe(false);
  });

  it("copies formatted comparison summary when clicking 요약 복사", async () => {
    const user = userEvent.setup();
    const writeTextMock = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    render(
      <TooltipProvider>
        <ToolCompareTable tools={sampleTools} />
      </TooltipProvider>,
    );

    await user.click(screen.getByRole("button", { name: "요약 복사" }));

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    const copied = writeTextMock.mock.calls[0]?.[0] as string;
    expect(copied).toContain("[알콕 AI 도구 비교] ChatGPT vs Claude");
    expect(copied).toContain("무료 플랜 있음");
  });

  it("renders responsive mobile card stack and 7-axis desktop table skeleton when isLoading", () => {
    const { container } = render(
      <ToolCompareTable tools={[]} isLoading toolCount={2} />,
    );

    expect(
      screen.getByRole("status", { name: "도구 비교표 불러오는 중" }),
    ).toBeInTheDocument();
    // Desktop table skeleton: 1 axis col + 2 tool cols = 3 column headers, 7 axis rows
    expect(container.querySelectorAll("thead th")).toHaveLength(3);
    expect(container.querySelectorAll("tbody tr")).toHaveLength(7);
    // Mobile card stack skeleton: 2 cards
    const mobileStack = container.querySelector(".md\\:hidden.flex-col");
    expect(mobileStack?.children).toHaveLength(2);
  });

  it("renders 7 preset card skeletons in hub mode and summary + table skeletons in compare mode", () => {
    const { container, rerender } = render(
      <ToolComparePageSkeleton mode="hub" />,
    );

    expect(
      screen.getByRole("status", { name: "도구 비교표 불러오는 중" }),
    ).toBeInTheDocument();
    const hubGrid = container.querySelector(".lg\\:grid-cols-3");
    expect(hubGrid?.children).toHaveLength(7);

    rerender(<ToolComparePageSkeleton mode="compare" toolCount={3} />);
    expect(
      screen.getByRole("status", { name: "비교 요약 불러오는 중" }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll("thead th")).toHaveLength(4);
  });
});
