import type { ReactNode } from "react";
import { AdminGuard, AdminShell } from "@/widgets/admin-shell";

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
