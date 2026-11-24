import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminGuard, AdminShell } from "@/widgets/admin-shell";

export const metadata: Metadata = {
  title: {
    default: "운영 대시보드",
    template: "%s | 알콕 관리자",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
