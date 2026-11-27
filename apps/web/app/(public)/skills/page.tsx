import type { Metadata } from "next";
import { SkillsListPage } from "@/views/skills";
import { serverApiGet } from "@alkok/core/server";
import type { ApiEnvelope, SkillDetailData } from "@alkok/core";

export const metadata: Metadata = {
  title: "플러그인 · 스킬 · MCP 디렉터리",
  description:
    "AI 에이전트용 스킬·플러그인·MCP의 설치 방법, 예시 요청, 비개발자 웹 AI 대안을 비교하세요.",
};

export default async function Page() {
  const res = await serverApiGet<ApiEnvelope<SkillDetailData[]>>(
    "/api/v1/skills?limit=50&sort=recommended",
    { revalidate: 60 },
  );
  return <SkillsListPage initialSkills={res?.data ?? []} />;
}
