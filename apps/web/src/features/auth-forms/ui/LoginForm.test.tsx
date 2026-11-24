import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@alkok/core";
import { LoginForm } from "./LoginForm";

const replaceMock = vi.fn();
const loginMutateAsyncMock = vi.fn();
const resendMutateAsyncMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => new URLSearchParams("next=https://evil.com"),
}));

vi.mock("../model/useAuthMutations", () => ({
  useLoginMutation: () => ({
    mutateAsync: loginMutateAsyncMock,
    isPending: false,
  }),
  useResendVerificationMutation: () => ({
    mutateAsync: resendMutateAsyncMock,
    isPending: false,
  }),
}));

describe("LoginForm", () => {
  it("shows 60s resend cooldown on AUTH_EMAIL_NOT_VERIFIED and blocks unsafe next redirect", async () => {
    loginMutateAsyncMock.mockRejectedValueOnce(
      new ApiError({
        statusCode: 403,
        errorCode: "AUTH_EMAIL_NOT_VERIFIED",
        message: "Email verification required",
      }),
    );
    resendMutateAsyncMock.mockResolvedValueOnce({ data: { sent: true } });

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>,
    );

    fireEvent.change(screen.getByLabelText(/이메일/), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호/), {
      target: { value: "Secret123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));

    expect(
      await screen.findByText("이메일 인증이 필요합니다."),
    ).toBeInTheDocument();

    const resendButton = screen.getByRole("button", {
      name: "인증 메일 재발송",
    });
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(resendMutateAsyncMock).toHaveBeenCalledWith("user@example.com");
      expect(
        screen.getByRole("button", { name: /인증 메일 재발송 \(60초\)/ }),
      ).toBeDisabled();
    });

    loginMutateAsyncMock.mockResolvedValueOnce({ data: { user: { id: "1" } } });
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/");
    });
  });
});
