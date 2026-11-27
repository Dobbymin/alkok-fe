import { TooltipProvider } from "@alkok/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetQuickSearchStore } from "@/features/quick-search";
import { resetAuthStore, useAuthStore } from "@alkok/core";
import { resetSidebarStore } from "../model/sidebar.store";
import { MOBILE_BOTTOM_TABS, MobileBottomTabs } from "./MobileBottomTabs";
import { PublicShell } from "./PublicShell";

let mockPathname = "/";
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => mockSearchParams,
}));

const setThemeMock = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", resolvedTheme: "light", setTheme: setThemeMock }),
}));

function renderShell(
  pathname = "/",
  counts = {
    guides: 14,
    tools: 20,
    news: 12,
    domains: {
      "docs-reports": 4,
      "meetings-comms": 3,
      research: 2,
      "data-sheets": 2,
      "planning-slides": 2,
      "content-design": 1,
      career: 13,
    },
  },
) {
  mockPathname = pathname;
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <TooltipProvider>
        <PublicShell counts={counts}>
          <div>본문</div>
        </PublicShell>
      </TooltipProvider>
    </QueryClientProvider>,
  );
}

describe("PublicShell, DesktopSidebar & MobileBottomTabs", () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
    resetAuthStore();
    resetSidebarStore();
    resetQuickSearchStore();
  });
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
    expect(sidebar.className).toContain("overflow-x-hidden");

    const sidebarBrand = sidebar.querySelector('a[aria-label="알콕(Alkok) 홈으로 이동"]');
    expect(sidebarBrand).not.toBeNull();
    expect(sidebarBrand?.className).toContain("whitespace-nowrap");
    expect(sidebarBrand?.className).toContain("shrink-0");

    const compareLink = screen.getByRole("link", { name: "도구 비교" });
    const toolsLink = screen.getByRole("link", { name: "AI 도구·모델" });
    expect(compareLink).toHaveAttribute("aria-current", "page");
    expect(toolsLink).not.toHaveAttribute("aria-current", "page");

    const collapseBtn = screen.getByRole("button", { name: "사이드바 접기" });
    expect(collapseBtn).toHaveAttribute("aria-expanded", "true");
    await user.click(collapseBtn);

    expect(sidebar.className).toContain("w-16");
    const expandBtn = screen.getByRole("button", { name: "사이드바 펼치기" });
    expect(expandBtn).toHaveAttribute("aria-expanded", "false");
    expect(expandBtn.className).toContain("h-9");
    expect(expandBtn.className).toContain("w-9");
    expect(expandBtn.querySelector("svg")?.getAttribute("class") ?? "").not.toContain("opacity-0");

    const collapsedBrand = sidebar.querySelector('a[aria-label="알콕(Alkok) 홈으로 이동"]');
    expect(collapsedBrand).toBeInTheDocument();
    expect(collapsedBrand?.className).toContain("h-9");
    expect(collapsedBrand?.className).toContain("w-9");

    const collapsedCompareLink = screen.getByRole("link", { name: "도구 비교" });
    expect(collapsedCompareLink.className).toContain("h-9");
    expect(collapsedCompareLink.className).toContain("w-9");
    expect(collapsedCompareLink.className).not.toContain("ring-1");
    expect(collapsedCompareLink.className).toContain("bg-secondary");

    const collapsedAccountLink = screen.getByRole("link", { name: "계정 · 동기화" });
    expect(collapsedAccountLink.className).toContain("h-9");
    expect(collapsedAccountLink.className).toContain("w-9");
    expect(collapsedAccountLink.className).not.toContain("bg-primary");
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

  it("renders work domain navigation links and count badges in sidebar", () => {
    mockSearchParams = new URLSearchParams("domain=docs-reports");
    renderShell("/");

    const docsLink = screen.getByRole("link", { name: "문서·보고서" });
    expect(docsLink).toHaveAttribute("href", "/?domain=docs-reports");
    expect(docsLink).toHaveAttribute("aria-current", "page");
    const careerLink = screen.getByRole("link", { name: "취업·이직" });
    expect(careerLink).toHaveAttribute("href", "/?domain=career");
    expect(screen.getByText("13")).toBeInTheDocument();
    expect(screen.getByText("14")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("renders account skeleton instead of flashing account sync link while auth is loading", () => {
    useAuthStore.setState({ user: null, isLoading: true });
    renderShell("/");

    expect(
      screen.getByRole("status", { name: "계정 정보 확인 중" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "계정 · 동기화" })).not.toBeInTheDocument();
  });

  it("renders low-emphasis ghost account sync entry when unauthenticated", () => {
    renderShell("/");

    const accountLink = screen.getByRole("link", { name: "계정 · 동기화" });
    expect(accountLink).toHaveAttribute("href", "/login");
    expect(accountLink.className).not.toContain("bg-primary");
  });

  it("opens mobile menu sheet from the right side matching the right hamburger trigger", async () => {
    const user = userEvent.setup();
    renderShell("/");

    await user.click(screen.getByRole("button", { name: "모바일 메뉴 열기" }));

    const dialog = await screen.findByRole("dialog", { name: "메뉴" });
    expect(dialog.className).toContain("end-0");
    expect(dialog.className).toContain("border-s");
    expect(dialog.className).not.toContain("start-0");

    const sheetAccountLink = screen.getAllByRole("link", { name: "계정 · 동기화" }).find((el) =>
      dialog.contains(el),
    );
    expect(sheetAccountLink).toBeDefined();
    expect(sheetAccountLink?.className).not.toContain("bg-primary");
  });

  it("does not expose /admin or 관리자 CMS links even when ADMIN is authenticated", () => {
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
    renderShell("/");

    expect(screen.queryByText("관리자 CMS")).not.toBeInTheDocument();
    const adminLinks = document.querySelectorAll('a[href="/admin"]');
    expect(adminLinks).toHaveLength(0);
  });
});
