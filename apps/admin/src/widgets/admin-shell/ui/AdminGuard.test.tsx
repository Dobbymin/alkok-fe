import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getWebUrl, resetAuthStore, useAuthStore } from "@alkok/core";
import { AdminGuard } from "./AdminGuard";
import { ADMIN_NAV_ITEMS, AdminShell } from "./AdminShell";

const replaceMock = vi.fn();
const routerReplaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/contents",
  useRouter: () => ({ replace: routerReplaceMock }),
}));

describe("AdminGuard & AdminShell", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    routerReplaceMock.mockReset();
    resetAuthStore();
    vi.restoreAllMocks();
  });

  it("redirects unauthenticated user to /login?next=...", () => {
    useAuthStore.setState({ user: null, isLoading: false });

    render(
      <AdminGuard onRedirectToLogin={replaceMock}>
        <div>관리자 콘텐츠</div>
      </AdminGuard>,
    );

    expect(replaceMock).toHaveBeenCalledWith("/login?next=%2Fcontents");
    expect(screen.queryByText("관리자 콘텐츠")).not.toBeInTheDocument();
  });

  it("blocks USER role with 403 message and links to public web", () => {
    useAuthStore.setState({
      user: {
        id: "u1",
        email: "user@alkok.kr",
        nickname: "일반유저",
        role: "USER",
        status: "ACTIVE",
      },
      isLoading: false,
    });

    render(
      <AdminGuard>
        <div>관리자 콘텐츠</div>
      </AdminGuard>,
    );

    expect(screen.getByText(/접근 권한이 없습니다/)).toBeInTheDocument();
    expect(screen.queryByText("관리자 콘텐츠")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "공개 웹으로 이동" }),
    ).toHaveAttribute("href", getWebUrl());
  });

  it("renders AdminShell with all 6 navigation items, web link, and logout for ADMIN role", async () => {
    const user = userEvent.setup();
    const logoutSpy = vi
      .spyOn(useAuthStore.getState(), "logout")
      .mockResolvedValue();

    useAuthStore.setState({
      user: {
        id: "a1",
        email: "admin@alkok.kr",
        nickname: "관리자",
        role: "ADMIN",
        status: "ACTIVE",
      },
      isLoading: false,
    });

    render(
      <AdminGuard>
        <AdminShell>
          <div>관리자 콘텐츠</div>
        </AdminShell>
      </AdminGuard>,
    );

    expect(screen.getByText("관리자 콘텐츠")).toBeInTheDocument();
    expect(ADMIN_NAV_ITEMS).toHaveLength(6);
    for (const item of ADMIN_NAV_ITEMS) {
      expect(screen.getAllByText(item.label).length).toBeGreaterThan(0);
    }
    expect(screen.getByRole("link", { name: "공개 웹" })).toHaveAttribute(
      "href",
      getWebUrl(),
    );

    await user.click(screen.getByRole("button", { name: "로그아웃" }));
    await waitFor(() => {
      expect(logoutSpy).toHaveBeenCalledTimes(1);
      expect(routerReplaceMock).toHaveBeenCalledWith("/login");
    });
  });

  it("renders shell-aligned w-60 skeleton while auth is loading", () => {
    useAuthStore.setState({ user: null, isLoading: true });

    const { container } = render(
      <AdminGuard>
        <div>관리자 콘텐츠</div>
      </AdminGuard>,
    );

    expect(
      screen.getByRole("status", { name: "관리자 인증 확인 중" }),
    ).toBeInTheDocument();
    expect(container.innerHTML).toContain("w-60");
    expect(screen.queryByText("관리자 콘텐츠")).not.toBeInTheDocument();
  });
});
