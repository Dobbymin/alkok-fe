import { TooltipProvider } from "@alkok/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MOBILE_BOTTOM_TABS, MobileBottomTabs } from "./MobileBottomTabs";
import { PublicShell } from "./PublicShell";

let mockPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
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

const setThemeMock = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", resolvedTheme: "light", setTheme: setThemeMock }),
}));

function renderShell(pathname = "/") {
  mockPathname = pathname;
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <TooltipProvider>
        <PublicShell>
          <div>본문</div>
        </PublicShell>
      </TooltipProvider>
    </QueryClientProvider>,
  );
}

describe("PublicShell, DesktopSidebar & MobileBottomTabs", () => {
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

  it("renders desktop left sidebar with skip link, search trigger, and collapsible rail", async () => {
    const user = userEvent.setup();
    renderShell("/tools/compare");

    expect(screen.getByRole("link", { name: "본문으로 건너뛰기" })).toHaveAttribute(
      "href",
      "#main-content",
    );

    const sidebar = screen.getByRole("complementary", { name: "주 사이드바" });
    expect(sidebar).toBeInTheDocument();
    expect(sidebar.className).toContain("w-60");

    const compareLink = screen.getByRole("link", { name: "도구 비교" });
    const toolsLink = screen.getByRole("link", { name: "AI 도구·모델" });
    expect(compareLink).toHaveAttribute("aria-current", "page");
    expect(toolsLink).not.toHaveAttribute("aria-current", "page");

    const collapseBtn = screen.getByRole("button", { name: "사이드바 접기" });
    expect(collapseBtn).toHaveAttribute("aria-expanded", "true");
    await user.click(collapseBtn);

    expect(sidebar.className).toContain("w-16");
    expect(screen.getByRole("button", { name: "사이드바 펼치기" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("applies pb-20 md:pb-8 safe bottom padding on main and Korean aria-labels on icon buttons", () => {
    renderShell("/");

    const main = screen.getByRole("main");
    expect(main.className).toContain("pb-20");
    expect(main.className).toContain("md:pb-8");
    expect(screen.getByRole("button", { name: "빠른 검색 열기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "통합 검색 열기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "모바일 메뉴 열기" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "테마 전환" }).length).toBeGreaterThan(0);
  });

  it("toggles explicitly to dark mode when clicking theme toggle from light mode", async () => {
    setThemeMock.mockClear();
    const user = userEvent.setup();
    renderShell("/");

    const toggleButtons = screen.getAllByRole("button", { name: "테마 전환" });
    await user.click(toggleButtons[0]!);
    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });
});
