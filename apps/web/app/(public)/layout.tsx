import type { ReactNode } from "react";
import { PublicShell } from "@/widgets/public-shell";
import { fetchPublicShellCounts } from "../_lib/public-catalog";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const counts = await fetchPublicShellCounts();
  return <PublicShell counts={counts}>{children}</PublicShell>;
}
