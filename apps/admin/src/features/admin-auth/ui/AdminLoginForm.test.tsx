import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, resetAuthStore, useAuthStore } from "@alkok/core";
import { adminAuthApi } from "../api";
import { AdminLoginForm } from "./AdminLoginForm";

const replaceMock = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => mockSearchParams,
}));

function renderForm() {
  const qc = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <AdminLoginForm />
    </QueryClientProvider>,
  );
}

describe("AdminLoginForm", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    mockSearchParams = new URLSearchParams();
    resetAuthStore();
    vi.restoreAllMocks();
  });

  it("sets session and redirects to nextPath when ADMIN logs in", async () => {
    const user = userEvent.setup();
    mockSearchParams = new URLSearchParams("next=/contents");
    vi.spyOn(adminAuthApi, "login").mockResolvedValue({
      data: {
        accessToken: "admin-token",
        user: {
          id: "a1",
          email: "admin@alkok.dobbymin.cloud",
          nickname: "관리자",
          role: "ADMIN",
          status: "ACTIVE",
        },
      },
    });

    renderForm();

    await user.type(
      screen.getByLabelText(/이메일/),
      "admin@alkok.dobbymin.cloud",
    );
    await user.type(screen.getByLabelText(/비밀번호/), "Password123!");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/contents");
    });
    expect(useAuthStore.getState().user?.role).toBe("ADMIN");
  });

  it("logs out immediately and shows error when non-ADMIN user logs in", async () => {
    const user = userEvent.setup();
    const logoutSpy = vi
      .spyOn(useAuthStore.getState(), "logout")
      .mockResolvedValue();
    vi.spyOn(adminAuthApi, "login").mockResolvedValue({
      data: {
        accessToken: "user-token",
        user: {
          id: "u1",
          email: "user@alkok.dobbymin.cloud",
          nickname: "일반유저",
          role: "USER",
          status: "ACTIVE",
        },
      },
    });

    renderForm();

    await user.type(
      screen.getByLabelText(/이메일/),
      "user@alkok.dobbymin.cloud",
    );
    await user.type(screen.getByLabelText(/비밀번호/), "Password123!");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "관리자(ADMIN) 계정으로만 로그인할 수 있습니다.",
      );
    });
    expect(logoutSpy).toHaveBeenCalledTimes(1);
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("displays API error message on invalid credentials", async () => {
    const user = userEvent.setup();
    vi.spyOn(adminAuthApi, "login").mockRejectedValue(
      new ApiError({
        statusCode: 401,
        errorCode: "INVALID_CREDENTIALS",
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      }),
    );

    renderForm();

    await user.type(
      screen.getByLabelText(/이메일/),
      "admin@alkok.dobbymin.cloud",
    );
    await user.type(screen.getByLabelText(/비밀번호/), "wrong-pass");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "이메일 또는 비밀번호가 올바르지 않습니다.",
      );
    });
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("redirects automatically if already authenticated as ADMIN", async () => {
    mockSearchParams = new URLSearchParams("next=/inbox");
    useAuthStore.setState({
      user: {
        id: "a1",
        email: "admin@alkok.dobbymin.cloud",
        nickname: "관리자",
        role: "ADMIN",
        status: "ACTIVE",
      },
      isLoading: false,
    });

    renderForm();

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/inbox");
    });
  });
});
