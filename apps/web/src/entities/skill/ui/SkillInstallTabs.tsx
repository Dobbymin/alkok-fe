"use client";

import type { SkillInstallGuide } from "@alkok/core";
import {
  CopyableCodeBlock,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@alkok/ui";

export interface SkillInstallTabsProps {
  installPrompt?: string | null;
  installGuides?: SkillInstallGuide[];
}

export const SkillInstallTabs = ({
  installPrompt,
  installGuides = [],
}: SkillInstallTabsProps) => {
  const safeGuides = installGuides ?? [];
  const defaultEnv = safeGuides[0]?.environment ?? "default";

  return (
    <div className="flex flex-col gap-4">
      {installPrompt ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-foreground">
            에이전트 채팅창에 바로 붙여넣는 설치 요청
          </p>
          <CopyableCodeBlock
            title="자연어 설치 요청"
            code={installPrompt}
            copyLabel="설치 요청 복사"
          />
        </div>
      ) : null}

      {safeGuides.length > 0 ? (
        <Tabs defaultValue={defaultEnv} className="w-full">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1">
            {safeGuides.map((g) => (
              <TabsTrigger key={g.environment} value={g.environment}>
                {g.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {safeGuides.map((g) => (
            <TabsContent
              key={g.environment}
              value={g.environment}
              className="mt-3 flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
            >
              <ol className="list-decimal space-y-2 pl-5 text-sm text-foreground">
                {(g.steps ?? []).map((step, idx) => (
                  <li key={idx} className="leading-[1.6]">
                    {step}
                  </li>
                ))}
              </ol>
              {g.command ? (
                <CopyableCodeBlock
                  title="설치·실행 명령어"
                  code={g.command}
                  copyLabel="명령어 복사"
                />
              ) : null}
              {g.invokeExample ? (
                <CopyableCodeBlock
                  title="호출 예시"
                  code={g.invokeExample}
                  copyLabel="예시 복사"
                />
              ) : null}
            </TabsContent>
          ))}
        </Tabs>
      ) : null}
    </div>
  );
};
