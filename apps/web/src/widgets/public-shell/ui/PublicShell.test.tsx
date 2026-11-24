import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MOBILE_BOTTOM_TABS, MobileBottomTabs } from "./MobileBottomTabs";
import { PublicShell } from "./PublicShell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@alkok/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@alkok/core")>();
  return {
    ...actual,
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    logout: vi.fn(),
  }),
};
});

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: vi.fn() }),
}));

describe("PublicShell & MobileBottomTabs", () => {
  it("isolates MobileBottomTabs with bottom-0 top-auto h-16 and renders 4 tabs", () => {
    render(<MobileBottomTabs />);
    const nav = screen.getByTestId("mobile-bottom-tabs");

    expect(nav.className).toContain("fixed");
    expect(nav.className).toContain("bottom-0");
    expect(nav.className).toContain("top-auto");
    expect(nav.className).toContain("h-16");
    expect(nav.className).toContain("md:hidden");
    expect(MOBILE_BOTTOM_TABS).toHaveLength(4);
  });

  it("applies pb-20 md:pb-8 safe bottom padding on main and Korean aria-labels on icon buttons", () => {
    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <PublicShell>
          <div>본문</div>
        </PublicShell>
      </QueryClientProvider>,
    );

    const main = screen.getByRole("main");
    expect(main.className).toContain("pb-20");
    expect(main.className).toContain("md:pb-8");
    expect(screen.getByRole("button", { name: "통합 검색 열기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "모바일 메뉴 열기" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "테마 전환" }).length).toBeGreaterThan(0);
  });
});
