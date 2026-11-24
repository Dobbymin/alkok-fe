"use client";

import { AuthProvider, QueryProvider, ThemeProvider } from "@alkok/core";
import { SonnerToaster, TooltipProvider } from "@alkok/ui";
import type { ReactNode } from "react";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <TooltipProvider delayDuration={200}>
            {children}
            <SonnerToaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
};
