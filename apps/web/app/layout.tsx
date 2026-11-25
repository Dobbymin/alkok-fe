import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { AppProviders } from "@/app/providers";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "알콕(Alkok) — AI 정보, 알맹이만 콕.",
    template: "%s | 알콕(Alkok)",
  },
  description:
    "실무 직장인을 위한 AI 업무 활용 가이드, AI 도구·모델 비교, 최신 AI 소식과 개인 지식 보관함.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${pretendard.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
