"use client";

import type { ReactNode } from "react";
import { AuthProvider, QueryProvider, ThemeProvider } from "@alkok/core";
import { SonnerToaster, TooltipProvider } from "@alkok/ui";
import { PwaUpdateProvider } from "./PwaUpdateProvider";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <TooltipProvider delayDuration={200}>
            {children}
            <PwaUpdateProvider />
            <SonnerToaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
};
