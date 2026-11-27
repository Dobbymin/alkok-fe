import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PromptCopyBlock } from "./PromptCopyBlock";
import { SafeMarkdown } from "./SafeMarkdown";

describe("PromptCopyBlock & SafeMarkdown", () => {
  it("highlights [variables] and shows check feedback on copy", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(
      <PromptCopyBlock
        title="회의록 요약"
        content="[회의록]을 3줄로 요약하고 [담당자]를 표기해줘."
        variables={["회의록", "담당자"]}
      />,
    );

    expect(screen.getByText("[회의록]")).toBeInTheDocument();
    expect(screen.getByText("[담당자]")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /프롬프트 복사/ }));
    expect(writeText).toHaveBeenCalledWith(
      "[회의록]을 3줄로 요약하고 [담당자]를 표기해줘.",
    );
    expect(await screen.findByText("복사됨")).toBeInTheDocument();
  });

  it("strips dangerous script tags and inline handlers in SafeMarkdown (SEC-02)", () => {
    const { container } = render(
      <SafeMarkdown
        content={'## 제목\n\n안전한 본문 <script>alert(1)</script> <img src=x onerror="alert(2)" />'}
      />,
    );

    expect(screen.getByText("제목")).toBeInTheDocument();
    expect(container.querySelector("script")).toBeNull();
    expect(container.innerHTML).not.toContain("onerror");
  });

  it("renders safely when content is undefined", () => {
    render(<PromptCopyBlock title="빈 프롬프트" content={undefined} />);
    expect(screen.getByText("빈 프롬프트")).toBeInTheDocument();
  });

  it("highlights {{variables}} and renders variableExamples, expectedOutput, and tips", () => {
    render(
      <PromptCopyBlock
        title="주간 보고"
        content="{{부서}}의 {{메모}}를 요약해줘"
        variables={["부서", "메모"]}
        variableExamples={{ 부서: "기획팀", 메모: "이번 주 완료 건" }}
        expectedOutput="4개 항목 보고서"
        tips="실명은 마스킹하세요"
      />,
    );

    expect(screen.getAllByText("{{부서}}").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("{{메모}}").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("기획팀")).toBeInTheDocument();
    expect(screen.getByText("4개 항목 보고서")).toBeInTheDocument();
    expect(screen.getByText("실명은 마스킹하세요")).toBeInTheDocument();
  });
});
