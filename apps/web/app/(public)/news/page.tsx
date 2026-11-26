import type { Metadata } from "next";
import { NewsListPage } from "@/views/news";
import { fetchHomeCatalog } from "../../_lib/public-catalog";

export const metadata: Metadata = {
  title: "AI 소식",
  description: "실무 직장인 관점의 핵심 3줄 요약과 업무 영향 분석 AI 소식.",
};

export default async function Page() {
  const catalog = await fetchHomeCatalog();
  return <NewsListPage initialNews={catalog.news} />;
}
