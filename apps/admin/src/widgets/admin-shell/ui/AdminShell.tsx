"use client";

import {
  FileText,
  Flag,
  Inbox,
  LayoutDashboard,
  Menu,
  Rss,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { cn } from "@alkok/core";
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@alkok/ui";

export const ADMIN_NAV_ITEMS = [
  { href: "/", label: "운영 대시보드", icon: LayoutDashboard },
  { href: "/inbox", label: "수집함 & 검수", icon: Inbox },
  { href: "/contents", label: "콘텐츠 관리", icon: FileText },
  { href: "/sources", label: "출처 관리", icon: Rss },
  { href: "/reports", label: "오류 제보함", icon: Flag },
  { href: "/users", label: "회원·권한 관리", icon: Users },
] as const;

function getCurrentPageLabel(pathname: string): string {
  const exact = ADMIN_NAV_ITEMS.find((item) => item.href === pathname);
  if (exact) return exact.label;
  const prefix = ADMIN_NAV_ITEMS.find(
    (item) => item.href !== "/" && pathname.startsWith(item.href),
  );
  return prefix?.label ?? "운영 대시보드";
}

const AdminNavLinks = ({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) => (
  <nav aria-label="관리자 메뉴" className="flex flex-col gap-1">
    {ADMIN_NAV_ITEMS.map((item) => {
      const Icon = item.icon;
      const isActive =
        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "flex h-9 items-center gap-3 rounded-lg px-3 text-sm [-webkit-tap-highlight-color:transparent] transition-[color,background-color] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            isActive
              ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
              : "font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "h-5 w-1 shrink-0 rounded-full",
              isActive ? "bg-primary" : "bg-transparent",
            )}
          />
          <Icon
            className="h-4 w-4 shrink-0"
            strokeWidth={isActive ? 2 : 1.75}
            absoluteStrokeWidth
            aria-hidden="true"
          />
          <span>{item.label}</span>
        </Link>
      );
    })}
  </nav>
);

export const AdminShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() || "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentLabel = getCurrentPageLabel(pathname);

  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-elevated"
      >
        본문으로 건너뛰기
      </a>

      {/* Desktop Left Sidebar */}
      <aside
        aria-label="관리자 사이드바"
        className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-e border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-separator px-4">
          <Link
            href="/"
            className="text-sm font-bold tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
          >
            Alkok Admin
          </Link>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            공개 웹
          </a>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain p-3">
          <AdminNavLinks pathname={pathname} />
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-card/95 px-6 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
            <div className="flex items-center gap-3">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="관리자 메뉴 열기"
                    className="h-11 w-11 lg:hidden"
                  >
                    <Menu
                      className="h-4 w-4"
                      strokeWidth={1.75}
                      absoluteStrokeWidth
                      aria-hidden="true"
                    />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-4">
                  <SheetHeader>
                    <SheetTitle>Alkok Admin</SheetTitle>
                  </SheetHeader>
                  <AdminNavLinks
                    pathname={pathname}
                    onNavigate={() => setMobileOpen(false)}
                  />
                  <div className="mt-6 border-t border-separator pt-4">
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a
                      href="/"
                      onClick={() => setMobileOpen(false)}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      공개 웹으로 이동
                    </a>
                  </div>
                </SheetContent>
              </Sheet>
              <nav aria-label="현재 위치" className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">관리자</span>
                <span className="text-muted-foreground" aria-hidden="true">
                  /
                </span>
                <span className="font-semibold text-foreground">{currentLabel}</span>
              </nav>
            </div>
          </div>
        </header>

        <main
          id="admin-main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl flex-1 px-6 py-6 focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
};
