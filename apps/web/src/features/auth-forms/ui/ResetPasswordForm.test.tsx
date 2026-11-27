import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ResetPasswordForm } from "./ResetPasswordForm";

let mockToken: string | null = null;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(mockToken ? `token=${mockToken}` : ""),
}));

describe("ResetPasswordForm", () => {
  it("validates request email and confirm new password", async () => {
    mockToken = null;
    const { rerender } = render(<ResetPasswordForm />);

    fireEvent.change(screen.getByLabelText(/이메일/), {
      target: { value: "invalid" },
    });
    fireEvent.click(screen.getByRole("button", { name: "재설정 메일 발송" }));

    expect(
      await screen.findByText("올바른 이메일 형식을 입력해 주세요."),
    ).toBeInTheDocument();

    mockToken = "reset-token";
    rerender(<ResetPasswordForm />);

    fireEvent.change(screen.getByLabelText(/새 비밀번호/), {
      target: { value: "short" },
    });
    fireEvent.click(screen.getByRole("button", { name: "새 비밀번호 확정" }));

    expect(
      await screen.findByText("비밀번호는 8자 이상 입력해 주세요."),
    ).toBeInTheDocument();
  });
});
