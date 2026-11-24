import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { NewsDetailData } from "@/shared/types";
import { TooltipProvider } from "@/shared/ui";
import NewsDetailPage from "./NewsDetailPage";

const sampleNews: NewsDetailData = {
  id: "n1",
  type: "NEWS",
  slug: "openai-canvas",
  title: "OpenAI 문서 협업 기능 업데이트",
  summary: "문서 편집과 코드 리뷰를 한 화면에서 처리할 수 있습니다.",
  publishStatus: "PUBLISHED",
  verificationStatus: "VALID",
  verifiedAt: "2026-11-24T00:00:00.000Z",
  sourceType: "OFFICIAL",
  sourceUrl: "https://openai.com/news/canvas",
  sourceName: "OpenAI News",
  helpfulCount: 4,
  keyPoints: ["요약 1", "요약 2", "요약 3"],
  workImpact: "보고서 초안 작성과 피드백 반복 시간이 단축됩니다.",
};

describe("NewsDetailPage", () => {
  it("renders 3 key points, work impact, and external source link", () => {
    render(
      <TooltipProvider>
        <NewsDetailPage
          news={sampleNews}
          bookmarkSlot={<span />}
          engagementSlot={<span />}
        />
      </TooltipProvider>,
    );

    expect(screen.getByText("요약 1")).toBeInTheDocument();
    expect(screen.getByText("요약 3")).toBeInTheDocument();
    expect(
      screen.getByText("보고서 초안 작성과 피드백 반복 시간이 단축됩니다."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /원문 출처 확인하기/ }),
    ).toHaveAttribute("href", "https://openai.com/news/canvas");
  });

  it("renders 404 ErrorState when news is null", () => {
    render(<NewsDetailPage news={null} />);
    expect(screen.getByText("소식을 찾을 수 없습니다.")).toBeInTheDocument();
  });
});
