import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { AppProviders } from "@/app/providers";
import { AdminGuard, AdminShell } from "@/widgets/admin-shell";
import "./globals.css";

const pretendard = localFont({
  src: "../../../packages/ui/src/assets/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "100 900",
});

const jetbrainsMono = localFont({
  src: "../../../packages/ui/src/assets/fonts/JetBrainsMonoVariable.woff2",
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: "100 800",
});

export const metadata: Metadata = {
  title: {
    default: "알콕 운영 콘솔",
    template: "%s | 알콕 운영 콘솔",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${pretendard.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <AppProviders>
          <AdminGuard>
            <AdminShell>{children}</AdminShell>
          </AdminGuard>
        </AppProviders>
      </body>
    </html>
  );
}
