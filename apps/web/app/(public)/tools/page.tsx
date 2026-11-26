import type { Metadata } from "next";
import { ToolsListPage } from "@/views/tools";
import { fetchHomeCatalog } from "../../_lib/public-catalog";

export const metadata: Metadata = {
  title: "AI 도구·모델 디렉터리",
  description: "무료 플랜·한국어 지원·실무 적합도로 AI 도구와 모델을 비교해 보세요.",
};

export default async function Page() {
  const catalog = await fetchHomeCatalog();
  return <ToolsListPage initialTools={catalog.tools} />;
}
