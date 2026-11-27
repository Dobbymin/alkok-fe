"use client";

import {
  CloudArrowUp,
  GearSix,
  MagnifyingGlass,
  SidebarSimple,
  SignOut,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useSyncExternalStore, type ComponentType } from "react";
import { WORK_DOMAINS } from "@/entities/taxonomy";
import { useLocalVaultStore, useVaultItemsQuery } from "@/entities/vault";
import { useQuickSearchStore } from "@/features/quick-search";
import { cn, selectIsAuthenticated, useAuthStore } from "@alkok/core";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@alkok/ui";
import type { PublicShellCounts } from "../model/shell-counts.types";
import { useSidebarStore } from "../model/sidebar.store";
import { BrandLogo } from "./BrandLogo";
import {
  CompareNavIcon,
  GuideNavIcon,
  HomeNavIcon,
  NewsNavIcon,
  SkillsNavIcon,
  ToolsNavIcon,
  VaultNavIcon,
  type NavIconProps,
} from "./NavIcons";
import { ThemeToggle } from "./ThemeToggle";

interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<NavIconProps>;
  match: (pathname: string) => boolean;
  count?: number;
}

const SettingsNavIcon = ({ active = false, className }: NavIconProps) => (
  <GearSix
    className={cn("shrink-0", className)}
    weight={active ? "duotone" : "regular"}
    aria-hidden="true"
  />
);

const EXPLORE_NAV: readonly NavItem[] = [
  {
    href: "/",
    label: "홈",
    icon: HomeNavIcon,
    match: (p) => p === "/",
  },
  {
    href: "/guides",
    label: "업무 가이드",
    icon: GuideNavIcon,
    match: (p) => p.startsWith("/guides"),
  },
  {
    href: "/tools",
    label: "AI 도구·모델",
    icon: ToolsNavIcon,
    match: (p) => p.startsWith("/tools") && !p.startsWith("/tools/compare"),
  },
  {
    href: "/tools/compare",
    label: "도구 비교",
    icon: CompareNavIcon,
    match: (p) => p.startsWith("/tools/compare"),
  },
  {
    href: "/skills",
    label: "스킬·플러그인",
    icon: SkillsNavIcon,
    match: (p) => p.startsWith("/skills"),
  },
  {
    href: "/news",
    label: "AI 소식",
    icon: NewsNavIcon,
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
      aria-label={collapsed ? item.label : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex h-9 items-center rounded-lg text-sm [-webkit-tap-highlight-color:transparent] transition-[color,background-color] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        collapsed ? "mx-auto w-9 justify-center px-0" : "gap-3 px-3",
        isActive
          ? collapsed
            ? "bg-secondary text-foreground"
            : "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
          : "font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {!collapsed ? (
        <span
          aria-hidden="true"
          className={cn(
            "h-5 w-1 shrink-0 rounded-full",
            isActive ? "bg-primary" : "bg-transparent",
          )}
        />
      ) : null}
      <Icon active={isActive} className="h-[18px] w-[18px] shrink-0" />
      {collapsed && isActive ? (
        <span
          aria-hidden="true"
          className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-primary"
        />
      ) : null}
      {!collapsed ? <span className="truncate">{item.label}</span> : null}
      {!collapsed && typeof item.count === "number" ? (
        <span
          aria-hidden="true"
          className="ms-auto tabular-nums text-[11px] font-medium text-muted-foreground"
        >
          {item.count}
        </span>
      ) : null}
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

function SidebarDomainSection({
  pathname,
  counts,
}: {
  pathname: string;
  counts?: PublicShellCounts;
}) {
  const searchParams = useSearchParams();
  const activeDomain = pathname === "/" ? (searchParams.get("domain") ?? "") : "";

  return (
    <div className="mt-6">
      <p className="whitespace-nowrap px-3 pb-2 text-[11px] font-medium tracking-[0.04em] text-muted-foreground">
        업무별 탐색
      </p>
      <div className="flex flex-col gap-0.5">
        {WORK_DOMAINS.map((domain) => {
          const isActive = activeDomain === domain.slug;
          const domainCount = counts?.domains[domain.slug];
          return (
            <Link
              key={domain.slug}
              href={`/?domain=${domain.slug}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-8 items-center gap-3 rounded-lg px-3 text-xs [-webkit-tap-highlight-color:transparent] transition-[color,background-color] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                isActive
                  ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                  : "font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "h-3.5 w-1 shrink-0 rounded-full",
                  isActive ? "bg-primary" : "bg-transparent",
                )}
              />
              <span className="truncate">{domain.name}</span>
              {typeof domainCount === "number" ? (
                <span
                  aria-hidden="true"
                  className="ms-auto tabular-nums text-[11px] font-medium text-muted-foreground"
                >
                  {domainCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SidebarDomainSectionSkeleton() {
  return (
    <div className="mt-6" aria-hidden="true">
      <p className="whitespace-nowrap px-3 pb-2 text-[11px] font-medium tracking-[0.04em] text-muted-foreground">
        업무별 탐색
      </p>
      <div className="flex flex-col gap-0.5">
        {WORK_DOMAINS.map((domain) => (
          <div
            key={domain.slug}
            className="flex h-8 items-center gap-3 rounded-lg px-3"
          >
            <span className="h-3.5 w-1 shrink-0 rounded-full bg-transparent" />
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="ms-auto h-3 w-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const DesktopSidebar = ({ counts }: { counts?: PublicShellCounts }) => {
  const pathname = usePathname() || "/";
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggleCollapsed = useSidebarStore((s) => s.toggleCollapsed);
  const openSearch = useQuickSearchStore((s) => s.openModal);
  const localVaultItems = useLocalVaultStore((s) => s.items);
  const vaultQuery = useVaultItemsQuery({ limit: 1 }, isAuthenticated);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    void useSidebarStore.persist.rehydrate();
    void useLocalVaultStore.persist.rehydrate();
  }, []);

  const savedCount = mounted
    ? isAuthenticated
      ? (vaultQuery.data?.meta?.total ?? 0)
      : localVaultItems.length
    : 0;

  const exploreItems: NavItem[] = EXPLORE_NAV.map((item) => {
    if (item.href === "/guides" && counts) return { ...item, count: counts.guides };
    if (item.href === "/tools" && counts) return { ...item, count: counts.tools };
    if (item.href === "/skills" && counts && typeof counts.skills === "number") {
      return { ...item, count: counts.skills };
    }
    if (item.href === "/news" && counts) return { ...item, count: counts.news };
    return item;
  });

  const workspaceItems: NavItem[] = [
    {
      href: "/vault",
      label: "내 보관함",
      icon: VaultNavIcon,
      match: (p) => p.startsWith("/vault"),
      count: savedCount > 0 ? savedCount : undefined,
    },
    ...(isAuthenticated
      ? [
          {
            href: "/settings",
            label: "설정",
            icon: SettingsNavIcon,
            match: (p: string) => p.startsWith("/settings"),
          },
        ]
      : []),
  ];

  const userInitial = user?.nickname?.slice(0, 1).toUpperCase() ?? "A";

  return (
    <aside
      aria-label="주 사이드바"
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col overflow-x-hidden border-e border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out md:flex",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Top: Brand & Collapse Toggle */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center gap-2 overflow-hidden px-3",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <BrandLogo
                compact
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-150 ease-out hover:bg-secondary"
              />
            </TooltipTrigger>
            <TooltipContent side="right">알콕 홈</TooltipContent>
          </Tooltip>
        ) : (
          <>
            <BrandLogo />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleCollapsed}
              aria-label="사이드바 접기"
              aria-expanded={true}
              className="shrink-0"
            >
              <SidebarSimple
                className="h-[18px] w-[18px]"
                weight="regular"
                aria-hidden="true"
              />
            </Button>
          </>
        )}
      </div>

      {/* Expand & Quick Search Triggers */}
      {collapsed ? (
        <div className="flex flex-col items-center gap-1 px-3 pt-1 pb-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggleCollapsed}
                aria-label="사이드바 펼치기"
                aria-expanded={false}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground [-webkit-tap-highlight-color:transparent] transition-colors duration-150 ease-out hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <SidebarSimple
                  weight="regular"
                  aria-hidden="true"
                  className="h-[18px] w-[18px]"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">사이드바 펼치기</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={openSearch}
                aria-label="빠른 검색 열기"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground [-webkit-tap-highlight-color:transparent] transition-colors duration-150 ease-out hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <MagnifyingGlass
                  className="h-[18px] w-[18px] shrink-0"
                  weight="regular"
                  aria-hidden="true"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">빠른 검색 (⌘K)</TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <div className="px-3 pt-1 pb-3">
          <button
            type="button"
            onClick={openSearch}
            aria-label="빠른 검색 열기"
            className="flex h-9 w-full items-center gap-2 rounded-lg border border-border/80 bg-surface-sunken px-3 text-xs text-muted-foreground [-webkit-tap-highlight-color:transparent] transition-[color,background-color,border-color] duration-150 ease-out hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <MagnifyingGlass
              className="h-4 w-4 shrink-0"
              weight="regular"
              aria-hidden="true"
            />
            <span className="truncate">빠른 검색</span>
            <kbd className="ms-auto rounded-xs border border-border bg-card px-2 py-1 font-mono text-[10px] tabular-nums text-muted-foreground">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {collapsed ? (
        <div aria-hidden="true" className="mx-auto my-2 h-px w-5 bg-separator" />
      ) : null}

      {/* Primary & Workspace Navigation */}
      <nav
        aria-label="주 메뉴"
        className="flex-1 overflow-y-auto overscroll-contain px-3 py-1"
      >
        {!collapsed ? (
          <p className="whitespace-nowrap px-3 pb-2 text-[11px] font-medium tracking-[0.04em] text-muted-foreground">
            탐색
          </p>
        ) : null}
        <div className="flex flex-col gap-1">
          {exploreItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              collapsed={collapsed}
            />
          ))}
        </div>

        {!collapsed ? (
          <Suspense fallback={<SidebarDomainSectionSkeleton />}>
            <SidebarDomainSection pathname={pathname} counts={counts} />
          </Suspense>
        ) : null}

        {collapsed ? (
          <div aria-hidden="true" className="mx-auto my-2 h-px w-5 bg-separator" />
        ) : null}

        <div className={collapsed ? "" : "mt-6"}>
          {!collapsed ? (
            <p className="whitespace-nowrap px-3 pb-2 text-[11px] font-medium tracking-[0.04em] text-muted-foreground">
              워크스페이스
            </p>
          ) : null}
          <div className="flex flex-col gap-1">
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
          "flex shrink-0 border-t border-separator p-3",
          collapsed
            ? "flex-col items-center gap-1.5"
            : "items-center justify-between gap-2",
        )}
      >
        {authLoading ? (
          <Skeleton
            role="status"
            aria-label="계정 정보 확인 중"
            className={cn("h-9", collapsed ? "w-9 rounded-lg" : "flex-1 rounded-md")}
          />
        ) : isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={collapsed ? "ghost" : "outline"}
                size="sm"
                aria-label="계정 메뉴 열기"
                className={cn(
                  "h-9 min-w-0",
                  collapsed
                    ? "w-9 justify-center rounded-lg px-0"
                    : "flex-1 justify-start gap-2 px-2",
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
                  <GearSix className="h-4 w-4" weight="regular" aria-hidden="true" />
                  설정
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <SignOut className="h-4 w-4" weight="regular" aria-hidden="true" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon-sm"
                className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <Link href="/login" aria-label="계정 · 동기화">
                  <CloudArrowUp
                    className="h-[18px] w-[18px]"
                    weight="regular"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              계정 · 동기화 · 로그인하면 보관함이 동기화돼요
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-9 min-w-0 flex-1 justify-start gap-2 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <Link href="/login" title="로그인하면 보관함이 동기화돼요">
                  <CloudArrowUp
                    className="h-4 w-4 shrink-0"
                    weight="regular"
                    aria-hidden="true"
                  />
                  <span className="truncate">계정 · 동기화</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">로그인하면 보관함이 동기화돼요</TooltipContent>
          </Tooltip>
        )}

        <ThemeToggle
          className={cn(
            "text-muted-foreground hover:text-foreground",
            collapsed && "h-9 w-9 rounded-lg",
          )}
        />
      </div>
    </aside>
  );
};
