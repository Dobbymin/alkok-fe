import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { SignupForm } from "./SignupForm";

beforeAll(() => {
  if (typeof globalThis.ResizeObserver === "undefined") {
    globalThis.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

const pushMock = vi.fn();
const signupMutateAsyncMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("../model/useAuthMutations", () => ({
  useSignupMutation: () => ({
    mutateAsync: signupMutateAsyncMock,
    isPending: false,
  }),
}));

describe("SignupForm", () => {
  it("validates email, nickname, password, and required terms agreement with Zod", async () => {
    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <SignupForm />
      </QueryClientProvider>,
    );

    fireEvent.change(screen.getByLabelText(/이메일/), {
      target: { value: "bad" },
    });
    fireEvent.change(screen.getByLabelText(/닉네임/), {
      target: { value: "a" },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호/), {
      target: { value: "1234" },
    });
    fireEvent.click(screen.getByRole("button", { name: "가입하기" }));

    expect(
      await screen.findByText("올바른 이메일 형식을 입력해 주세요."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("닉네임은 2자 이상 입력해 주세요."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("비밀번호는 8자 이상 입력해 주세요."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("필수 이용약관에 동의해 주세요."),
    ).toBeInTheDocument();
    expect(signupMutateAsyncMock).not.toHaveBeenCalled();

    signupMutateAsyncMock.mockResolvedValueOnce({ data: { ok: true } });
    fireEvent.change(screen.getByLabelText(/이메일/), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/닉네임/), {
      target: { value: "알콕유저" },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호/), {
      target: { value: "Secret123!" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "가입하기" }));

    await waitFor(() => {
      expect(signupMutateAsyncMock).toHaveBeenCalledWith({
        email: "user@example.com",
        nickname: "알콕유저",
        password: "Secret123!",
      });
      expect(pushMock).toHaveBeenCalledWith(
        "/verify-email?email=user%40example.com",
      );
    });
  });
});
