import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AdminGuard } from "./AdminGuard";
import { ADMIN_NAV_ITEMS, AdminShell } from "./AdminShell";

const replaceMock = vi.fn();
let mockAuthState = {
  user: null as { id: string; email: string; nickname: string; role: "USER" | "ADMIN"; status: "ACTIVE" } | null,
  isAuthenticated: false,
  isLoading: false,
};

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/contents",
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock("@/shared/auth", () => ({
  useAuth: () => mockAuthState,
}));

describe("AdminGuard & AdminShell", () => {
  beforeEach(() => {
    replaceMock.mockReset();
  });

  it("redirects unauthenticated user to /login?next=...", () => {
    mockAuthState = { user: null, isAuthenticated: false, isLoading: false };

    render(
      <AdminGuard>
        <div>관리자 콘텐츠</div>
      </AdminGuard>,
    );

    expect(replaceMock).toHaveBeenCalledWith("/login?next=%2Fadmin%2Fcontents");
    expect(screen.queryByText("관리자 콘텐츠")).not.toBeInTheDocument();
  });

  it("blocks USER role with 403 message", () => {
    mockAuthState = {
      user: {
        id: "u1",
        email: "user@alkok.kr",
        nickname: "일반유저",
        role: "USER",
        status: "ACTIVE",
      },
      isAuthenticated: true,
      isLoading: false,
    };

    render(
      <AdminGuard>
        <div>관리자 콘텐츠</div>
      </AdminGuard>,
    );

    expect(screen.getByText(/접근 권한이 없습니다/)).toBeInTheDocument();
    expect(screen.queryByText("관리자 콘텐츠")).not.toBeInTheDocument();
  });

  it("renders AdminShell with all 6 navigation items for ADMIN role", () => {
    mockAuthState = {
      user: {
        id: "a1",
        email: "admin@alkok.kr",
        nickname: "관리자",
        role: "ADMIN",
        status: "ACTIVE",
      },
      isAuthenticated: true,
      isLoading: false,
    };

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
});
