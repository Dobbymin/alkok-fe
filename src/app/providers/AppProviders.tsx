"use client";

import type { ReactNode } from "react";
import { SonnerToaster, TooltipProvider } from "@/shared/ui";
import { AuthProvider } from "./AuthProvider";
import { PwaUpdateProvider } from "./PwaUpdateProvider";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";

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
