import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppProviders } from "@/app/providers";
import "@/shared/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "알콕(Alkok) — AI 정보, 알맹이만 콕.",
    template: "%s | 알콕(Alkok)",
  },
  description:
    "실무 직장인을 위한 AI 업무 활용 가이드, AI 도구·모델 비교, 최신 AI 소식과 개인 지식 보관함.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
