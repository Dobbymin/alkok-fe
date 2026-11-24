"use client";

import { useState, type ReactNode } from "react";
import { QuickSearchModal } from "@/features/quick-search";
import { DesktopHeader } from "./DesktopHeader";
import { MobileBottomTabs } from "./MobileBottomTabs";
import { MobileHeader } from "./MobileHeader";

export interface PublicShellProps {
  children: ReactNode;
}

export const PublicShell = ({ children }: PublicShellProps) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <DesktopHeader onOpenSearch={() => setSearchOpen(true)} />
      <MobileHeader onOpenSearch={() => setSearchOpen(true)} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-20 md:pb-8">
        {children}
      </main>

      <MobileBottomTabs />

      <QuickSearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
};
