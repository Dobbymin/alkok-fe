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
});
