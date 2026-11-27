import Link from "next/link";
import type { ReactNode } from "react";
import type { DifficultyLevel, SkillDetailData, SkillKind } from "@alkok/core";
import { Badge, Card, CardContent, CardHeader } from "@alkok/ui";

export const SKILL_KIND_LABELS: Record<SkillKind, string> = {
  SKILL: "에이전트 스킬",
  PLUGIN: "플러그인",
  MCP: "MCP 서버",
};

const SKILL_DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  BEGINNER: "입문",
  PRACTICAL: "실무",
  ADVANCED: "응용",
};

export interface SkillSpecCardProps {
  skill: SkillDetailData;
  verificationSlot?: ReactNode;
  bookmarkSlot?: ReactNode;
}

export const SkillSpecCard = ({
  skill,
  verificationSlot,
  bookmarkSlot,
}: SkillSpecCardProps) => {
  const agents = skill.compatibleAgents ?? [];
  const visibleAgents = agents.slice(0, 3);
  const extraCount = Math.max(0, agents.length - visibleAgents.length);
  const verifiedDate = skill.verifiedAt ? skill.verifiedAt.slice(0, 10) : null;

  return (
    <Card
      variant="outline"
      className="group flex h-full flex-col justify-between transition-colors duration-150 ease-out hover:border-primary/40 hover:bg-card"
    >
      <CardHeader className="gap-2 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary">{SKILL_KIND_LABELS[skill.skillKind]}</Badge>
            <Badge variant="outline">{SKILL_DIFFICULTY_LABELS[skill.difficulty]}</Badge>
            {skill.license ? (
              <Badge variant="outline">{skill.license}</Badge>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            {verificationSlot}
            {bookmarkSlot}
          </div>
        </div>

        <Link
          href={`/skills/${skill.slug}`}
          className="break-keep line-clamp-2 text-base font-semibold leading-[1.35] text-foreground transition-colors group-hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {skill.title}
        </Link>

        <p className="break-keep line-clamp-2 text-xs leading-[1.55] text-muted-foreground">
          {skill.summary}
        </p>

        {visibleAgents.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1 pt-1">
            {visibleAgents.map((agent) => (
              <Badge key={agent} variant="outline" className="text-[11px]">
                {agent}
              </Badge>
            ))}
            {extraCount > 0 ? (
              <span className="text-[11px] text-muted-foreground">+{extraCount}</span>
            ) : null}
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="flex items-center justify-between gap-2 border-t border-separator pt-3 text-xs text-muted-foreground">
        <span className="truncate">{skill.authorName}</span>
        <span className="shrink-0 tabular-nums">
          {verifiedDate ? `확인일 ${verifiedDate}` : "확인일 미정"}
        </span>
      </CardContent>
    </Card>
  );
};
