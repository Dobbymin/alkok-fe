"use client";

import { Bookmark, BookOpen, Home, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@alkok/core";

export const MOBILE_BOTTOM_TABS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/guides", label: "가이드", icon: BookOpen },
  { href: "/tools", label: "도구", icon: Wrench },
  { href: "/vault", label: "보관함", icon: Bookmark },
] as const;

export const MobileBottomTabs = () => {
  const pathname = usePathname() || "/";

  return (
    <nav
      aria-label="모바일 하단 탭"
      data-testid="mobile-bottom-tabs"
      className="fixed inset-x-0 bottom-0 top-auto z-40 h-16 border-t border-border bg-sidebar/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden"
    >
      <div className="grid h-full grid-cols-4">
        {MOBILE_BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-11 flex-col items-center justify-center gap-1 border-t-2 text-[11px] [-webkit-tap-highlight-color:transparent] transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                isActive
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent font-medium text-muted-foreground",
              )}
            >
              <Icon
                className="h-5 w-5"
                strokeWidth={isActive ? 2 : 1.75}
                absoluteStrokeWidth
                aria-hidden="true"
              />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
