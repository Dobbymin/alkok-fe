import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminContentFormDialog } from "./AdminContentFormDialog";

describe("AdminContentFormDialog", () => {
  it("validates required title, summary, and source URL", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <AdminContentFormDialog
        open
        onOpenChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(
      await screen.findByText("제목을 입력해 주세요."),
    ).toBeInTheDocument();
    expect(screen.getByText("요약을 입력해 주세요.")).toBeInTheDocument();
    expect(
      screen.getByText("원문/공식 출처 URL을 입력해 주세요."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
