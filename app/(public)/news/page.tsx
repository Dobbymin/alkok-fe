import type { Metadata } from "next";
import { NewsListPage } from "@/views/news";

export const metadata: Metadata = {
  title: "AI 소식",
  description: "실무 직장인 관점의 핵심 3줄 요약과 업무 영향 분석 AI 소식.",
};

export default function Page() {
  return <NewsListPage />;
}
