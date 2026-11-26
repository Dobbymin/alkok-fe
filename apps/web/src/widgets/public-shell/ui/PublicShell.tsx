"use client";

import type { ReactNode } from "react";
import { QuickSearchModal } from "@/features/quick-search";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileBottomTabs } from "./MobileBottomTabs";
import { MobileHeader } from "./MobileHeader";

export interface PublicShellProps {
  children: ReactNode;
}

export const PublicShell = ({ children }: PublicShellProps) => {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground md:flex-row">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-elevated"
      >
        본문으로 건너뛰기
      </a>

      <DesktopSidebar />
      <MobileHeader />

      <div className="flex min-w-0 flex-1 flex-col">
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl flex-1 px-6 pt-6 pb-20 focus:outline-none md:py-8 md:pb-8"
        >
          {children}
        </main>
      </div>

      <MobileBottomTabs />

      <QuickSearchModal />
    </div>
  );
};
