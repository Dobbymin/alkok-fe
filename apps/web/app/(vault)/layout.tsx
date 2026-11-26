import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PublicShell } from "@/widgets/public-shell";
import { fetchPublicShellCounts } from "../_lib/public-catalog";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function VaultLayout({
  children,
}: {
  children: ReactNode;
}) {
  const counts = await fetchPublicShellCounts();
  return <PublicShell counts={counts}>{children}</PublicShell>;
}
