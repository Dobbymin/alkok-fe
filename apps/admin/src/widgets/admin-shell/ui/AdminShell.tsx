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
            "flex h-9 items-center gap-2.5 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isActive
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
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
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Left Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link
            href="/"
            className="text-sm font-bold tracking-tight text-foreground"
          >
            Alkok Admin
          </Link>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            공개 웹 →
          </a>
        </div>
        <div className="flex-1 p-3">
          <AdminNavLinks pathname={pathname} />
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="관리자 메뉴 열기"
                  className="lg:hidden"
                >
                  <Menu className="h-4 w-4" strokeWidth={1.75} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4">
                <SheetHeader className="mb-4">
                  <SheetTitle>Alkok Admin</SheetTitle>
                </SheetHeader>
                <AdminNavLinks
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
                <div className="mt-6 border-t border-border pt-4">
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    공개 웹으로 이동 →
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
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
