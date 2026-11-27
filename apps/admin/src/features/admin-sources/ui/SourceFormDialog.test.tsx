import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SourceFormDialog } from "./SourceFormDialog";

describe("SourceFormDialog", () => {
  it("validates source name, feed URL, and interval bounds", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <SourceFormDialog open onOpenChange={vi.fn()} onSubmit={onSubmit} />,
    );

    fireEvent.change(screen.getByLabelText(/Feed URL/), {
      target: { value: "invalid-url" },
    });
    fireEvent.change(screen.getByLabelText(/수집 주기/), {
      target: { value: "200" },
    });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(
      await screen.findByText("출처명을 입력해 주세요."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "http:// 또는 https://로 시작하는 올바른 URL을 입력해 주세요.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("수집 주기는 168시간 이하로 입력해 주세요."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
