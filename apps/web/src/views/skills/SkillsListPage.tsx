"use client";

import { useState } from "react";
import { VerificationBadge } from "@/entities/content";
import {
  SKILL_KIND_LABELS,
  SkillSpecCard,
  useSkillsList,
} from "@/entities/skill";
import { DIFFICULTY_LABELS, WORK_DOMAINS } from "@/entities/taxonomy";
import { BookmarkAction } from "@/features/vault-save";
import type { DifficultyLevel, SkillDetailData, SkillKind } from "@alkok/core";
import {
  Button,
  Checkbox,
  EmptyState,
  ErrorState,
  FilterBar,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@alkok/ui";

const COMPATIBLE_AGENT_OPTIONS = [
  "Claude Code",
  "Claude.ai",
  "Codex",
  "Cursor",
  "Antigravity",
] as const;

export interface SkillsListPageProps {
  initialSkills?: SkillDetailData[];
}

export default function SkillsListPage({
  initialSkills = [],
}: SkillsListPageProps) {
  const [skillKind, setSkillKind] = useState<SkillKind | "ALL">("ALL");
  const [agent, setAgent] = useState("ALL");
  const [difficulty, setDifficulty] = useState<DifficultyLevel | "ALL">("ALL");
  const [workDomain, setWorkDomain] = useState("ALL");
  const [validOnly, setValidOnly] = useState(true);
  const [sort, setSort] = useState<"recommended" | "latest" | "helpful">(
    "recommended",
  );

  const isDefaultFilter =
    skillKind === "ALL" &&
    agent === "ALL" &&
    difficulty === "ALL" &&
    workDomain === "ALL" &&
    validOnly &&
    sort === "recommended";

  const query = useSkillsList({
    skillKind: skillKind === "ALL" ? "" : skillKind,
    agent: agent === "ALL" ? "" : agent,
    difficulty: difficulty === "ALL" ? "" : difficulty,
    workDomain: workDomain === "ALL" ? "" : workDomain,
    validOnly,
    sort,
  });

  const skills = query.data?.data ?? (isDefaultFilter ? initialSkills : []);
  const showSkeleton = query.isLoading && skills.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          플러그인 · 스킬 · MCP 디렉터리
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          에이전트에 바로 연결해 쓰는 스킬·플러그인·MCP의 설치 방법, 예시 요청, 비개발자 웹 AI 대안을 확인하세요.
        </p>
      </div>

      <Tabs
        value={skillKind}
        onValueChange={(v) => setSkillKind(v as SkillKind | "ALL")}
      >
        <TabsList>
          <TabsTrigger value="ALL">전체</TabsTrigger>
          <TabsTrigger value="SKILL">{SKILL_KIND_LABELS.SKILL}</TabsTrigger>
          <TabsTrigger value="PLUGIN">{SKILL_KIND_LABELS.PLUGIN}</TabsTrigger>
          <TabsTrigger value="MCP">{SKILL_KIND_LABELS.MCP}</TabsTrigger>
        </TabsList>
      </Tabs>

      <FilterBar>
        <Select value={agent} onValueChange={setAgent}>
          <SelectTrigger className="w-[160px]" aria-label="호환 에이전트 필터">
            <SelectValue placeholder="호환 에이전트" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체 에이전트</SelectItem>
            {COMPATIBLE_AGENT_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={difficulty}
          onValueChange={(v) => setDifficulty(v as DifficultyLevel | "ALL")}
        >
          <SelectTrigger className="w-[140px]" aria-label="도입 난이도 필터">
            <SelectValue placeholder="도입 난이도" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체 난이도</SelectItem>
            {(Object.keys(DIFFICULTY_LABELS) as DifficultyLevel[]).map((lvl) => (
              <SelectItem key={lvl} value={lvl}>
                {DIFFICULTY_LABELS[lvl]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={workDomain} onValueChange={setWorkDomain}>
          <SelectTrigger className="w-[160px]" aria-label="업무 도메인 필터">
            <SelectValue placeholder="업무 도메인" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체 업무 도메인</SelectItem>
            {WORK_DOMAINS.map((d) => (
              <SelectItem key={d.slug} value={d.slug}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(v) =>
            setSort(v as "recommended" | "latest" | "helpful")
          }
        >
          <SelectTrigger className="w-[130px]" aria-label="정렬 기준">
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">추천순</SelectItem>
            <SelectItem value="latest">최신순</SelectItem>
            <SelectItem value="helpful">도움됨순</SelectItem>
          </SelectContent>
        </Select>

        <Label className="flex min-h-10 cursor-pointer items-center gap-2 px-2 text-xs font-medium">
          <Checkbox
            checked={validOnly}
            onCheckedChange={(checked) => setValidOnly(Boolean(checked))}
          />
          <span>유효 정보만</span>
        </Label>

        {!isDefaultFilter ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setSkillKind("ALL");
              setAgent("ALL");
              setDifficulty("ALL");
              setWorkDomain("ALL");
              setValidOnly(true);
              setSort("recommended");
            }}
          >
            필터 초기화
          </Button>
        ) : null}
      </FilterBar>

      {query.isError && skills.length === 0 ? (
        <ErrorState
          title="플러그인·스킬 목록을 불러오지 못했습니다."
          action={
            <Button size="sm" onClick={() => query.refetch()}>
              다시 시도
            </Button>
          }
        />
      ) : showSkeleton ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-52 w-full rounded-xl" />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <EmptyState
          title="조건에 맞는 플러그인·스킬이 없습니다."
          description="호환 에이전트나 난이도 필터를 조정해 보세요."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <SkillSpecCard
              key={skill.id}
              skill={skill}
              verificationSlot={
                <VerificationBadge
                  status={skill.verificationStatus}
                  verifiedAt={skill.verifiedAt}
                  sourceType={skill.sourceType}
                />
              }
              bookmarkSlot={
                <BookmarkAction
                  contentId={skill.id}
                  title={skill.title}
                  contentType={skill.type}
                  slug={skill.slug}
                  summary={skill.summary}
                />
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
