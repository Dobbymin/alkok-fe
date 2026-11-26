import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetAuthStore, useAuthStore } from "@alkok/core";
import { AdminGuard } from "./AdminGuard";
import { ADMIN_NAV_ITEMS, AdminShell } from "./AdminShell";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/contents",
}));

describe("AdminGuard & AdminShell", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    resetAuthStore();
  });

  it("redirects unauthenticated user to /login?next=...", () => {
    useAuthStore.setState({ user: null, isLoading: false });

    render(
      <AdminGuard onRedirectToLogin={replaceMock}>
        <div>관리자 콘텐츠</div>
      </AdminGuard>,
    );

    expect(replaceMock).toHaveBeenCalledWith("/login?next=%2Fadmin%2Fcontents");
    expect(screen.queryByText("관리자 콘텐츠")).not.toBeInTheDocument();
  });

  it("blocks USER role with 403 message", () => {
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
  });

  it("renders AdminShell with all 6 navigation items for ADMIN role", () => {
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
