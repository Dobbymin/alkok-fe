import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetAuthStore, useAuthStore } from "@alkok/core";
import { SettingsForms } from "./SettingsForms";

const replaceMock = vi.fn();
const deleteMutateAsyncMock = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock("../model/useAuthMutations", () => ({
  useDeleteAccountMutation: () => ({
    mutateAsync: deleteMutateAsyncMock,
    isPending: false,
  }),
}));

describe("SettingsForms", () => {
  beforeEach(() => {
    resetAuthStore();
    useAuthStore.setState({
      user: {
        id: "u1",
        email: "user@example.com",
        nickname: "테스터",
        role: "USER",
        status: "ACTIVE",
        interestCategorySlugs: ["marketing"],
      },
      isLoading: false,
    });
  });
  it("requires 2-step confirmation dialog before deleting account", async () => {
    deleteMutateAsyncMock.mockResolvedValueOnce(undefined);
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SettingsForms />
      </QueryClientProvider>,
    );

    const openDeleteBtn = screen.getByRole("button", { name: "회원 탈퇴" });
    fireEvent.click(openDeleteBtn);

    expect(
      await screen.findByText(/정말 탈퇴하시겠습니까/i),
    ).toBeInTheDocument();
    expect(deleteMutateAsyncMock).not.toHaveBeenCalled();

    const confirmBtn = screen.getByRole("button", { name: "영구 탈퇴 확인" });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(deleteMutateAsyncMock).toHaveBeenCalledTimes(1);
      expect(replaceMock).toHaveBeenCalledWith("/");
    });
  });

  it("validates nickname and password change forms inline", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <SettingsForms />
      </QueryClientProvider>,
    );

    fireEvent.change(screen.getByLabelText(/닉네임/), {
      target: { value: "a" },
    });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(
      await screen.findByText("닉네임은 2자 이상 입력해 주세요."),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/새 비밀번호/), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "비밀번호 변경" }));

    expect(
      await screen.findByText("비밀번호는 8자 이상 입력해 주세요."),
    ).toBeInTheDocument();
    expect(screen.getByText("비밀번호를 입력해 주세요.")).toBeInTheDocument();
  });
});
