"use client";

import {
  Bookmark,
  BookOpen,
  Home,
  LogOut,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Scale,
  Search,
  Settings,
  Shield,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { cn, useAuth } from "@alkok/core";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@alkok/ui";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";

const SIDEBAR_STORAGE_KEY = "alkok-sidebar-collapsed";
const SIDEBAR_CHANGE_EVENT = "alkok-sidebar-collapsed-change";

function subscribeSidebar(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(SIDEBAR_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SIDEBAR_CHANGE_EVENT, callback);
  };
}

function getSidebarSnapshot(): boolean {
  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function getSidebarServerSnapshot(): boolean {
  return false;
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
  match: (pathname: string) => boolean;
}

const EXPLORE_NAV: readonly NavItem[] = [
  {
    href: "/",
    label: "홈",
    icon: Home,
    match: (p) => p === "/",
  },
  {
    href: "/guides",
    label: "업무 가이드",
    icon: BookOpen,
    match: (p) => p.startsWith("/guides"),
  },
  {
    href: "/tools",
    label: "AI 도구·모델",
    icon: Wrench,
    match: (p) => p.startsWith("/tools") && !p.startsWith("/tools/compare"),
  },
  {
    href: "/tools/compare",
    label: "도구 비교",
    icon: Scale,
    match: (p) => p.startsWith("/tools/compare"),
  },
  {
    href: "/news",
    label: "AI 소식",
    icon: Newspaper,
    match: (p) => p.startsWith("/news"),
  },
];

function NavLink({
  item,
  pathname,
  collapsed,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  const isActive = item.match(pathname);

  const link = (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm [-webkit-tap-highlight-color:transparent] transition-[color,background-color] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        collapsed && "justify-center px-0",
        isActive
          ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground before:absolute before:inset-y-1.5 before:start-0 before:w-0.5 before:rounded-full before:bg-primary"
          : "font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      <Icon
        className="h-4 w-4 shrink-0"
        strokeWidth={isActive ? 2 : 1.75}
        absoluteStrokeWidth
        aria-hidden="true"
      />
      {!collapsed ? <span className="truncate">{item.label}</span> : null}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

export const DesktopSidebar = ({
  onOpenSearch,
}: {
  onOpenSearch?: () => void;
}) => {
  const pathname = usePathname() || "/";
  const { user, isAuthenticated, logout } = useAuth();
  const collapsed = useSyncExternalStore(
    subscribeSidebar,
    getSidebarSnapshot,
    getSidebarServerSnapshot,
  );

  const toggleCollapsed = () => {
    try {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(!collapsed));
      window.dispatchEvent(new Event(SIDEBAR_CHANGE_EVENT));
    } catch {
      // ignore storage errors
    }
  };

  const workspaceItems: NavItem[] = [
    {
      href: "/vault",
      label: "내 보관함",
      icon: Bookmark,
      match: (p) => p.startsWith("/vault"),
    },
    ...(isAuthenticated
      ? [
          {
            href: "/settings",
            label: "설정",
            icon: Settings,
            match: (p: string) => p.startsWith("/settings"),
          },
        ]
      : []),
    ...(isAuthenticated && user?.role === "ADMIN"
      ? [
          {
            href: "/admin",
            label: "관리자 CMS",
            icon: Shield,
            match: (p: string) => p.startsWith("/admin"),
          },
        ]
      : []),
  ];

  const searchButton = (
    <button
      type="button"
      onClick={onOpenSearch}
      aria-label="빠른 검색 열기"
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-lg border border-border/80 bg-surface-sunken px-2.5 text-xs text-muted-foreground [-webkit-tap-highlight-color:transparent] transition-[color,background-color,border-color] duration-150 ease-out hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        collapsed && "justify-center px-0",
      )}
    >
      <Search
        className="h-3.5 w-3.5 shrink-0"
        strokeWidth={1.75}
        absoluteStrokeWidth
        aria-hidden="true"
      />
      {!collapsed ? (
        <>
          <span className="truncate">빠른 검색</span>
          <kbd className="ms-auto rounded-xs border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-muted-foreground">
            ⌘K
          </kbd>
        </>
      ) : null}
    </button>
  );

  const userInitial = user?.nickname?.slice(0, 1).toUpperCase() ?? "A";

  return (
    <aside
      aria-label="주 사이드바"
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col border-e border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out md:flex",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Top: Brand & Collapse Toggle */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center px-3",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed ? <BrandLogo /> : null}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
          aria-expanded={!collapsed}
        >
          {collapsed ? (
            <PanelLeftOpen
              className="h-4 w-4"
              strokeWidth={1.75}
              absoluteStrokeWidth
              aria-hidden="true"
            />
          ) : (
            <PanelLeftClose
              className="h-4 w-4"
              strokeWidth={1.75}
              absoluteStrokeWidth
              aria-hidden="true"
            />
          )}
        </Button>
      </div>

      {/* Quick Search Trigger */}
      <div className="px-2.5 pt-1 pb-3">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>{searchButton}</TooltipTrigger>
            <TooltipContent side="right">빠른 검색 (⌘K)</TooltipContent>
          </Tooltip>
        ) : (
          searchButton
        )}
      </div>

      {/* Primary & Workspace Navigation */}
      <nav
        aria-label="주 메뉴"
        className="flex-1 overflow-y-auto overscroll-contain px-2.5 py-1"
      >
        {!collapsed ? (
          <p className="px-2.5 pb-1.5 text-[11px] font-medium tracking-[0.04em] text-muted-foreground">
            탐색
          </p>
        ) : null}
        <div className="flex flex-col gap-0.5">
          {EXPLORE_NAV.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              collapsed={collapsed}
            />
          ))}
        </div>

        <div className="mt-6">
          {!collapsed ? (
            <p className="px-2.5 pb-1.5 text-[11px] font-medium tracking-[0.04em] text-muted-foreground">
              워크스페이스
            </p>
          ) : null}
          <div className="flex flex-col gap-0.5">
            {workspaceItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                pathname={pathname}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom: Account & Theme */}
      <div
        className={cn(
          "flex shrink-0 border-t border-separator p-2.5",
          collapsed
            ? "flex-col items-center gap-2"
            : "items-center justify-between gap-2",
        )}
      >
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                aria-label="계정 메뉴 열기"
                className={cn(
                  "h-8 min-w-0",
                  collapsed ? "w-8 px-0 justify-center" : "flex-1 justify-start gap-2 px-2",
                )}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground"
                >
                  {userInitial}
                </span>
                {!collapsed ? (
                  <span className="truncate text-xs">{user.nickname}</span>
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start">
              <DropdownMenuItem asChild>
                <Link href="/vault">내 보관함</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  설정
                </Link>
              </DropdownMenuItem>
              {user.role === "ADMIN" ? (
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <Shield className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    관리자 CMS
                  </Link>
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            asChild
            size="sm"
            className={cn("h-8", collapsed ? "w-10 px-0 text-[11px]" : "flex-1")}
          >
            <Link href="/login">로그인</Link>
          </Button>
        )}

        <ThemeToggle />
      </div>
    </aside>
  );
};
