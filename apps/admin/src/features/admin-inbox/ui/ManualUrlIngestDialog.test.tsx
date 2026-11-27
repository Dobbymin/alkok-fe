import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ManualUrlIngestDialog } from "./ManualUrlIngestDialog";

describe("ManualUrlIngestDialog", () => {
  it("validates URL scheme and submits valid URL", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onOpenChange = vi.fn();

    render(
      <ManualUrlIngestDialog
        open
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByLabelText(/원문 URL/), {
      target: { value: "not-a-url" },
    });
    fireEvent.click(screen.getByRole("button", { name: "수집·초안 생성" }));

    expect(
      await screen.findByText(
        "http:// 또는 https://로 시작하는 올바른 URL을 입력해 주세요.",
      ),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/원문 URL/), {
      target: { value: "https://openai.com/index/news" },
    });
    fireEvent.click(screen.getByRole("button", { name: "수집·초안 생성" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("https://openai.com/index/news");
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
