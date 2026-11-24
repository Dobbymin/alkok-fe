import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AdminReviewSplitView } from "./AdminReviewSplitView";

const sampleItem = {
  id: "inbox-1",
  type: "NEWS" as const,
  title: "OpenAI 신규 모델 발표",
  summary: "실무자용 핵심 요약",
  sourceType: "OFFICIAL" as const,
  sourceUrl: "https://openai.com/news",
  sourceName: "OpenAI News",
  rawTextExcerpt: "Original English announcement text...",
  evidenceNotes: ["무료 플랜 월 10회 제공 명시"],
  unverifiedFields: ["한국어 UI 지원 여부"],
  tags: ["openai", "gpt"],
  workImpact: "보고서 작성 속도 향상",
};

describe("AdminReviewSplitView", () => {
  it("renders source evidence, unverified highlight, and triggers approve callback", async () => {
    const user = userEvent.setup();
    const onApprove = vi.fn();
    const onSaveDraft = vi.fn();
    const onReject = vi.fn();

    render(
      <AdminReviewSplitView
        item={sampleItem}
        onApprove={onApprove}
        onSaveDraft={onSaveDraft}
        onReject={onReject}
      />,
    );

    expect(screen.getAllByText("한국어 UI 지원 여부").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/무료 플랜 월 10회/).length).toBeGreaterThan(0);

    const approveButtons = screen.getAllByRole("button", {
      name: /승인·즉시 공개/,
    });
    await user.click(approveButtons[0]!);

    expect(onApprove).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "OpenAI 신규 모델 발표",
        tags: ["openai", "gpt"],
      }),
    );
  });
});
