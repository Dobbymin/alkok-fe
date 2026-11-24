"use client";

import { LogOut, Menu, Newspaper, Search, Settings, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@alkok/core";
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@alkok/ui";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";

export const MobileHeader = ({
  onOpenSearch,
}: {
  onOpenSearch?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur md:hidden">
      <BrandLogo />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="통합 검색 열기"
          onClick={onOpenSearch}
          className="h-10 w-10"
        >
          <Search className="h-5 w-5" strokeWidth={1.75} />
        </Button>

        <ThemeToggle />

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="모바일 메뉴 열기"
              className="h-10 w-10"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>메뉴</SheetTitle>
            </SheetHeader>
            <nav aria-label="모바일 보조 메뉴" className="mt-4 flex flex-col gap-1">
              <Link
                href="/news"
                onClick={() => setOpen(false)}
                className="flex h-11 items-center gap-2.5 rounded-md px-3 text-sm font-medium hover:bg-secondary"
              >
                <Newspaper className="h-4 w-4" strokeWidth={1.75} />
                AI 소식
              </Link>
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex h-11 items-center gap-2.5 rounded-md px-3 text-sm font-medium hover:bg-secondary"
              >
                <Settings className="h-4 w-4" strokeWidth={1.75} />
                설정
              </Link>
              {user?.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex h-11 items-center gap-2.5 rounded-md px-3 text-sm font-medium hover:bg-secondary"
                >
                  <Shield className="h-4 w-4" strokeWidth={1.75} />
                  관리자 CMS
                </Link>
              ) : null}
              <div className="my-2 border-t border-border" />
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="justify-start gap-2"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.75} />
                  로그아웃
                </Button>
              ) : (
                <Button asChild onClick={() => setOpen(false)}>
                  <Link href="/login">로그인 / 회원가입</Link>
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
