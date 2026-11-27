"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  parseCommaSeparated,
  parseNewlineSeparated,
  type ContentSummary,
} from "@alkok/core";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FieldGroup,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@alkok/ui";
import type { AdminContentCreatePayload } from "../api/admin-contents.api";
import {
  adminContentFormSchema,
  type AdminContentFormValues,
} from "../model/admin-content-form.schema";

interface AdminContentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ContentSummary | null;
  onSubmit: (payload: AdminContentCreatePayload) => Promise<void>;
  isPending?: boolean;
}

const getDefaultValues = (
  initialData?: ContentSummary | null,
): AdminContentFormValues => ({
  type: initialData?.type ?? "GUIDE",
  publishStatus: initialData?.publishStatus ?? "PUBLISHED",
  sourceType: initialData?.sourceType ?? "OFFICIAL",
  title: initialData?.title ?? "",
  summary: initialData?.summary ?? "",
  sourceUrl: initialData?.sourceUrl ?? "",
  difficulty: "PRACTICAL",
  pricingModel: "FREEMIUM",
  markdownBody: "",
  promptContent: "",
  toolKind: "TOOL",
  providerName: "",
  pricingSummary: "",
  koreanSupport: "FULL",
  keyPointsRaw: "",
  workImpact: "",
  skillKind: "SKILL",
  skillSlug: "",
  authorName: "",
  license: "",
  compatibleAgentsRaw: "",
  overview: "",
  installPrompt: "",
  useCasesRaw: "",
  tipsRaw: "",
  tagsRaw: "",
});

export const AdminContentFormDialog = ({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending = false,
}: AdminContentFormDialogProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminContentFormValues>({
    resolver: zodResolver(adminContentFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: getDefaultValues(initialData),
  });

  useEffect(() => {
    if (!open) return;
    reset(getDefaultValues(initialData));
  }, [open, initialData, reset]);

  const type = useWatch({ control, name: "type" });

  const handleValidSubmit = async (values: AdminContentFormValues) => {
    const tagSlugs = parseCommaSeparated(values.tagsRaw, true);

    const payload: AdminContentCreatePayload = {
      type: values.type,
      title: values.title.trim(),
      summary: values.summary.trim(),
      publishStatus: values.publishStatus,
      sourceType: values.sourceType,
      sourceUrl: values.sourceUrl.trim(),
      tagSlugs,
    };

    if (values.type === "GUIDE") {
      payload.difficulty = values.difficulty;
      payload.pricingModel = values.pricingModel;
      payload.markdownBody = values.markdownBody.trim();
      if (values.promptContent.trim()) {
        payload.prompts = [
          {
            title: "기본 프롬프트",
            content: values.promptContent.trim(),
            variables: [],
          },
        ];
      }
    } else if (values.type === "TOOL") {
      payload.toolKind = values.toolKind;
      payload.providerName = values.providerName.trim();
      payload.officialUrl = values.sourceUrl.trim();
      payload.pricingModel = values.pricingModel;
      payload.hasFreePlan = values.pricingModel !== "PAID";
      payload.pricingSummary = values.pricingSummary.trim();
      payload.koreanSupport = values.koreanSupport;
    } else if (values.type === "NEWS") {
      payload.keyPoints = parseNewlineSeparated(values.keyPointsRaw, 3);
      payload.workImpact = values.workImpact.trim();
    } else if (values.type === "SKILL") {
      payload.skillKind = values.skillKind;
      payload.skillSlug = values.skillSlug.trim() || undefined;
      payload.authorName = values.authorName.trim() || undefined;
      payload.license = values.license.trim() || undefined;
      payload.repositoryUrl = values.sourceUrl.trim();
      payload.compatibleAgents = parseCommaSeparated(values.compatibleAgentsRaw);
      payload.overview = values.overview.trim() || values.summary.trim();
      payload.installPrompt = values.installPrompt.trim() || undefined;
      payload.useCases = parseNewlineSeparated(values.useCasesRaw);
      payload.tips = parseNewlineSeparated(values.tipsRaw);
    }

    await onSubmit(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] max-w-2xl overflow-y-auto overscroll-contain">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "콘텐츠 수정" : "새 콘텐츠 수동 작성"}
          </DialogTitle>
          <DialogDescription>
            가이드, 도구·모델, AI 소식을 직접 등록하거나 수정합니다.
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          onSubmit={handleSubmit(handleValidSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FieldGroup label="유형" required>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={Boolean(initialData)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GUIDE">업무 가이드</SelectItem>
                      <SelectItem value="TOOL">도구·모델</SelectItem>
                      <SelectItem value="SKILL">플러그인·스킬·MCP</SelectItem>
                      <SelectItem value="NEWS">AI 소식</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldGroup>

            <FieldGroup label="발행 상태" required>
              <Controller
                name="publishStatus"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">초안 (DRAFT)</SelectItem>
                      <SelectItem value="IN_REVIEW">검수 중 (IN_REVIEW)</SelectItem>
                      <SelectItem value="PUBLISHED">공개 (PUBLISHED)</SelectItem>
                      <SelectItem value="ARCHIVED">보관 (ARCHIVED)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldGroup>

            <FieldGroup label="출처 유형" required>
              <Controller
                name="sourceType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OFFICIAL">공식</SelectItem>
                      <SelectItem value="MEDIA">전문 미디어</SelectItem>
                      <SelectItem value="COMMUNITY">커뮤니티</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldGroup>
          </div>

          <FieldGroup
            htmlFor="content-title"
            label="제목"
            required
            error={errors.title?.message}
            errorId="content-title-error"
          >
            <Input
              id="content-title"
              placeholder="예: 회의록 3분 요약 실무 가이드"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "content-title-error" : undefined}
              {...register("title")}
            />
          </FieldGroup>

          <FieldGroup
            htmlFor="content-summary"
            label="요약"
            required
            error={errors.summary?.message}
            errorId="content-summary-error"
          >
            <Textarea
              id="content-summary"
              placeholder="핵심 결론과 활용 대상을 1~2줄로 작성하세요."
              aria-invalid={Boolean(errors.summary)}
              aria-describedby={
                errors.summary ? "content-summary-error" : undefined
              }
              {...register("summary")}
            />
          </FieldGroup>

          <FieldGroup
            htmlFor="content-source-url"
            label="원문/공식 출처 URL"
            required
            error={errors.sourceUrl?.message}
            errorId="content-source-url-error"
          >
            <Input
              id="content-source-url"
              type="url"
              placeholder="https://example.com"
              aria-invalid={Boolean(errors.sourceUrl)}
              aria-describedby={
                errors.sourceUrl ? "content-source-url-error" : undefined
              }
              {...register("sourceUrl")}
            />
          </FieldGroup>

          {type === "GUIDE" ? (
            <div className="flex flex-col gap-3 rounded-md border border-border bg-muted/30 p-3">
              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="난이도">
                  <Controller
                    name="difficulty"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BEGINNER">입문</SelectItem>
                          <SelectItem value="PRACTICAL">실무</SelectItem>
                          <SelectItem value="ADVANCED">응용</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FieldGroup>
                <FieldGroup label="과금 형태">
                  <Controller
                    name="pricingModel"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FREE">무료</SelectItem>
                          <SelectItem value="FREEMIUM">무료+유료</SelectItem>
                          <SelectItem value="PAID">유료</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FieldGroup>
              </div>
              <FieldGroup htmlFor="guide-md" label="본문 (Markdown)">
                <Textarea
                  id="guide-md"
                  placeholder="## 1단계..."
                  {...register("markdownBody")}
                />
              </FieldGroup>
              <FieldGroup htmlFor="guide-prompt" label="프롬프트 블록">
                <Textarea
                  id="guide-prompt"
                  placeholder="다음 [회의록]을 요약해줘."
                  {...register("promptContent")}
                />
              </FieldGroup>
            </div>
          ) : null}

          {type === "TOOL" ? (
            <div className="flex flex-col gap-3 rounded-md border border-border bg-muted/30 p-3">
              <div className="grid grid-cols-3 gap-3">
                <FieldGroup label="구분">
                  <Controller
                    name="toolKind"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TOOL">AI 도구</SelectItem>
                          <SelectItem value="MODEL">AI 모델</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FieldGroup>
                <FieldGroup htmlFor="tool-provider" label="제공사">
                  <Input
                    id="tool-provider"
                    placeholder="OpenAI"
                    {...register("providerName")}
                  />
                </FieldGroup>
                <FieldGroup label="한국어 지원">
                  <Controller
                    name="koreanSupport"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FULL">완전 지원</SelectItem>
                          <SelectItem value="PARTIAL">부분 지원</SelectItem>
                          <SelectItem value="NONE">미지원</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FieldGroup>
              </div>
              <FieldGroup htmlFor="tool-pricing" label="요금·무료 한도 요약">
                <Input
                  id="tool-pricing"
                  placeholder="무료 플랜 제공 / Plus 월 $20"
                  {...register("pricingSummary")}
                />
              </FieldGroup>
            </div>
          ) : null}

          {type === "NEWS" ? (
            <div className="flex flex-col gap-3 rounded-md border border-border bg-muted/30 p-3">
              <FieldGroup htmlFor="news-keypoints" label="핵심 3줄 요약 (줄바꿈 구분)">
                <Textarea
                  id="news-keypoints"
                  placeholder={"1. 핵심 변화...\n2. 적용 대상...\n3. 요금/일정..."}
                  {...register("keyPointsRaw")}
                />
              </FieldGroup>
              <FieldGroup htmlFor="news-impact" label="실무 영향">
                <Textarea
                  id="news-impact"
                  placeholder="실무 직장인에게 어떤 변화가 있는지 요약하세요."
                  {...register("workImpact")}
                />
              </FieldGroup>
            </div>
          ) : null}

          {type === "SKILL" ? (
            <div className="flex flex-col gap-3 rounded-md border border-border bg-muted/30 p-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <FieldGroup label="세부 유형">
                  <Controller
                    name="skillKind"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SKILL">에이전트 스킬</SelectItem>
                          <SelectItem value="PLUGIN">플러그인</SelectItem>
                          <SelectItem value="MCP">MCP 서버</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FieldGroup>
                <FieldGroup
                  htmlFor="skill-slug"
                  label="스킬 슬러그"
                  error={errors.skillSlug?.message}
                  errorId="skill-slug-error"
                >
                  <Input
                    id="skill-slug"
                    placeholder="humanize-korean"
                    aria-invalid={Boolean(errors.skillSlug)}
                    aria-describedby={
                      errors.skillSlug ? "skill-slug-error" : undefined
                    }
                    {...register("skillSlug")}
                  />
                </FieldGroup>
                <FieldGroup htmlFor="skill-author" label="제작자">
                  <Input
                    id="skill-author"
                    placeholder="epoko77-ai"
                    {...register("authorName")}
                  />
                </FieldGroup>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FieldGroup htmlFor="skill-license" label="라이선스">
                  <Input
                    id="skill-license"
                    placeholder="MIT"
                    {...register("license")}
                  />
                </FieldGroup>
                <FieldGroup
                  htmlFor="skill-agents"
                  label="호환 에이전트 (쉼표 구분)"
                >
                  <Input
                    id="skill-agents"
                    placeholder="Claude Code, Codex, Cursor"
                    {...register("compatibleAgentsRaw")}
                  />
                </FieldGroup>
              </div>
              <FieldGroup htmlFor="skill-overview" label="상세 개요">
                <Textarea
                  id="skill-overview"
                  placeholder="어떤 상황에서 왜 필요한 스킬·플러그인인지 설명하세요."
                  {...register("overview")}
                />
              </FieldGroup>
              <FieldGroup
                htmlFor="skill-install-prompt"
                label="자연어 설치 요청 프롬프트"
              >
                <Textarea
                  id="skill-install-prompt"
                  placeholder="에이전트에 붙여넣을 설치 요청문을 입력하세요."
                  {...register("installPrompt")}
                />
              </FieldGroup>
              <FieldGroup htmlFor="skill-use-cases" label="활용 상황 (줄바꿈 구분)">
                <Textarea
                  id="skill-use-cases"
                  placeholder="이럴 때 써보세요 항목을 줄바꿈으로 입력하세요."
                  {...register("useCasesRaw")}
                />
              </FieldGroup>
              <FieldGroup htmlFor="skill-tips" label="실무 팁 (줄바꿈 구분)">
                <Textarea
                  id="skill-tips"
                  placeholder="실무 팁을 줄바꿈으로 입력하세요."
                  {...register("tipsRaw")}
                />
              </FieldGroup>
            </div>
          ) : null}

          <FieldGroup htmlFor="content-tags" label="태그 (쉼표 구분)">
            <Input
              id="content-tags"
              placeholder="회의록, 요약, chatgpt"
              {...register("tagsRaw")}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
