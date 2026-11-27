"use client";

import {
  CloudArrowUp,
  GearSix,
  List,
  MagnifyingGlass,
  ShieldCheck,
  SignOut,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { WORK_DOMAINS } from "@/entities/taxonomy";
import { useQuickSearchStore } from "@/features/quick-search";
import { cn, selectIsAuthenticated, useAuthStore } from "@alkok/core";
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@alkok/ui";
import type { PublicShellCounts } from "../model/shell-counts.types";
import { BrandLogo } from "./BrandLogo";
import {
  CompareNavIcon,
  GuideNavIcon,
  HomeNavIcon,
  NewsNavIcon,
  SkillsNavIcon,
  ToolsNavIcon,
  VaultNavIcon,
} from "./NavIcons";
import { ThemeToggle } from "./ThemeToggle";

const MOBILE_NAV = [
  { href: "/", label: "홈", icon: HomeNavIcon, match: (p: string) => p === "/" },
  {
    href: "/guides",
    label: "업무 가이드",
    icon: GuideNavIcon,
    match: (p: string) => p.startsWith("/guides"),
    countKey: "guides" as const,
  },
  {
    href: "/tools",
    label: "AI 도구·모델",
    icon: ToolsNavIcon,
    match: (p: string) => p.startsWith("/tools") && !p.startsWith("/tools/compare"),
    countKey: "tools" as const,
  },
  {
    href: "/tools/compare",
    label: "도구 비교",
    icon: CompareNavIcon,
    match: (p: string) => p.startsWith("/tools/compare"),
  },
  {
    href: "/skills",
    label: "스킬·플러그인",
    icon: SkillsNavIcon,
    match: (p: string) => p.startsWith("/skills"),
    countKey: "skills" as const,
  },
  {
    href: "/news",
    label: "AI 소식",
    icon: NewsNavIcon,
    match: (p: string) => p.startsWith("/news"),
    countKey: "news" as const,
  },
] as const;

export const MobileHeader = ({ counts }: { counts?: PublicShellCounts }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const openSearch = useQuickSearchStore((s) => s.openModal);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-sidebar/95 px-6 backdrop-blur-sm md:hidden">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between">
        <BrandLogo />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="통합 검색 열기"
            onClick={openSearch}
            className="h-11 w-11"
          >
            <MagnifyingGlass
              className="h-5 w-5"
              weight="regular"
              aria-hidden="true"
            />
          </Button>

          <ThemeToggle className="h-11 w-11" />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="모바일 메뉴 열기"
                className="h-11 w-11"
              >
                <List
                  className="h-5 w-5"
                  weight="regular"
                  aria-hidden="true"
                />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>메뉴</SheetTitle>
              </SheetHeader>
              <nav aria-label="모바일 보조 메뉴" className="flex flex-col gap-1">
                {MOBILE_NAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.match(pathname);
                  const itemCount =
                    "countKey" in item && counts ? counts[item.countKey] : undefined;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-[color,background-color] duration-150 ease-out",
                        isActive
                          ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                          : "font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      <Icon active={isActive} className="h-[18px] w-[18px] shrink-0" />
                      <span>{item.label}</span>
                      {typeof itemCount === "number" ? (
                        <span
                          aria-hidden="true"
                          className="ms-auto tabular-nums text-xs text-muted-foreground"
                        >
                          {itemCount}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}

                <div className="mt-4 flex flex-col gap-1">
                  <p className="px-3 pb-1 text-[11px] font-medium tracking-[0.04em] text-muted-foreground">
                    업무별 탐색
                  </p>
                  {WORK_DOMAINS.map((domain) => {
                    const domainCount = counts?.domains[domain.slug];
                    return (
                      <Link
                        key={domain.slug}
                        href={`/?domain=${domain.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex h-10 items-center justify-between rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <span>{domain.name}</span>
                        {typeof domainCount === "number" ? (
                          <span
                            aria-hidden="true"
                            className="tabular-nums text-[11px] text-muted-foreground"
                          >
                            {domainCount}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-col gap-1">
                  <Link
                    href="/vault"
                    onClick={() => setOpen(false)}
                    aria-current={pathname.startsWith("/vault") ? "page" : undefined}
                    className={cn(
                      "flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-[color,background-color] duration-150 ease-out",
                      pathname.startsWith("/vault")
                        ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                        : "font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <VaultNavIcon
                      active={pathname.startsWith("/vault")}
                      className="h-[18px] w-[18px] shrink-0"
                    />
                    내 보관함
                  </Link>
                  {isAuthenticated ? (
                    <Link
                      href="/settings"
                      onClick={() => setOpen(false)}
                      aria-current={pathname.startsWith("/settings") ? "page" : undefined}
                      className={cn(
                        "flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-[color,background-color] duration-150 ease-out",
                        pathname.startsWith("/settings")
                          ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                          : "font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      <GearSix
                        className="h-[18px] w-[18px] shrink-0"
                        weight={pathname.startsWith("/settings") ? "duotone" : "regular"}
                        aria-hidden="true"
                      />
                      설정
                    </Link>
                  ) : null}
                  {user?.role === "ADMIN" ? (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <ShieldCheck
                        className="h-[18px] w-[18px] shrink-0"
                        weight={pathname.startsWith("/admin") ? "duotone" : "regular"}
                        aria-hidden="true"
                      />
                      관리자 CMS
                    </Link>
                  ) : null}
                </div>

                <div className="my-3 border-t border-separator" />
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="h-11 justify-start gap-2"
                  >
                    <SignOut
                      className="h-4 w-4"
                      weight="regular"
                      aria-hidden="true"
                    />
                    로그아웃
                  </Button>
                ) : (
                  <div className="flex flex-col gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      onClick={() => setOpen(false)}
                      className="h-11 w-full justify-start gap-2.5 px-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <Link href="/login">
                        <CloudArrowUp
                          className="h-[18px] w-[18px] shrink-0"
                          weight="regular"
                          aria-hidden="true"
                        />
                        계정 · 동기화
                      </Link>
                    </Button>
                    <p className="px-3 text-xs text-muted-foreground">
                      로그인하면 보관함이 동기화돼요
                    </p>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
