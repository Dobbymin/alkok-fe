"use client";

import { LogOut, Search, Settings, Shield, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/shared/auth";
import { cn } from "@/shared/lib";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";

const DESKTOP_NAV = [
  { href: "/", label: "홈" },
  { href: "/guides", label: "가이드" },
  { href: "/tools", label: "도구" },
  { href: "/news", label: "소식" },
  { href: "/vault", label: "보관함" },
] as const;

export const DesktopHeader = ({
  onOpenSearch,
}: {
  onOpenSearch?: () => void;
}) => {
  const pathname = usePathname() || "/";
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 hidden h-14 border-b border-border bg-card/95 backdrop-blur md:block">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <BrandLogo />
          <nav aria-label="주 메뉴" className="flex items-center gap-1">
            {DESKTOP_NAV.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSearch}
            aria-label="빠른 검색 열기"
            className="h-8 gap-2 px-3 text-xs text-muted-foreground"
          >
            <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>검색</span>
            <kbd className="rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </Button>

          <ThemeToggle />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="계정 메뉴 열기"
                  className="h-8 gap-1.5"
                >
                  <User className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span className="max-w-24 truncate">{user.nickname}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/vault">내 보관함</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4" strokeWidth={1.75} />
                    설정
                  </Link>
                </DropdownMenuItem>
                {user.role === "ADMIN" ? (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Shield className="h-4 w-4" strokeWidth={1.75} />
                      관리자 CMS
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="h-4 w-4" strokeWidth={1.75} />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="h-8">
              <Link href="/login">로그인</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
