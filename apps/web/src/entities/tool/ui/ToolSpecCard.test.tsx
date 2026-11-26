import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ToolDetailData } from "@alkok/core";
import { ToolSpecCard } from "./ToolSpecCard";

const mockTool: ToolDetailData = {
  id: "t1",
  type: "TOOL",
  slug: "chatgpt",
  title: "ChatGPT",
  summary: "범용 대화형 AI 도구",
  publishStatus: "PUBLISHED",
  verificationStatus: "VALID",
  verifiedAt: "2026-11-25T10:00:00.000Z",
  sourceType: "OFFICIAL",
  sourceUrl: "https://chatgpt.com",
  helpfulCount: 0,
  toolKind: "TOOL",
  providerName: "OpenAI",
  officialUrl: "https://chatgpt.com",
  pricingModel: "FREEMIUM",
  hasFreePlan: true,
  pricingSummary: "무료 플랜 제공 / Plus 월 $20",
  koreanSupport: "FULL",
  platforms: ["Web", "iOS", "Desktop"],
  strengths: ["보고서 초안과 회의록 요약에 강점"],
  limitations: ["최신 사내 문서는 직접 업로드 필요"],
};

describe("ToolSpecCard", () => {
  it("renders tool specs, pricing, korean support, verified date, and compare slot", () => {
    render(
      <ToolSpecCard
        tool={mockTool}
        verificationSlot={<span>검증됨</span>}
        compareSlot={<button type="button">비교 담기</button>}
      />,
    );

    expect(screen.getByRole("link", { name: "ChatGPT" })).toHaveAttribute(
      "href",
      "/tools/chatgpt",
    );
    expect(screen.getByText("무료 플랜 있음")).toBeInTheDocument();
    expect(screen.getByText("한국어 완전 지원")).toBeInTheDocument();
    expect(screen.getByText("무료 플랜 제공 / Plus 월 $20")).toBeInTheDocument();
    expect(screen.getByText("보고서 초안과 회의록 요약에 강점")).toBeInTheDocument();
    expect(screen.getByText("확인일 2026-11-25")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "비교 담기" })).toBeInTheDocument();
  });
});
