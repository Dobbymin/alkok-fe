import type { Metadata } from "next";
import { GuidesListPage } from "@/views/guides";

export const metadata: Metadata = {
  title: "업무 활용 가이드",
  description: "실무 직장인을 위한 단계별 AI 활용 가이드와 복사 가능한 프롬프트 모음.",
};

export default function Page() {
  return <GuidesListPage />;
}
