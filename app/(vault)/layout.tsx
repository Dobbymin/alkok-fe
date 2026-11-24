import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PublicShell } from "@/widgets/public-shell";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function VaultLayout({ children }: { children: ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
