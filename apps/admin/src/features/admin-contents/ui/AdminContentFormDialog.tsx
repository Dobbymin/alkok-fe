"use client";

import { useState, type FormEvent } from "react";
import type {
  ContentSummary,
  ContentType,
  DifficultyLevel,
  KoreanSupportLevel,
  PricingModel,
  PublishStatus,
  SourceType,
  ToolKind,
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

interface AdminContentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ContentSummary | null;
  onSubmit: (payload: AdminContentCreatePayload) => Promise<void>;
  isPending?: boolean;
}

export const AdminContentFormDialog = ({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending = false,
}: AdminContentFormDialogProps) => {
  const [type, setType] = useState<ContentType>(initialData?.type ?? "GUIDE");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [summary, setSummary] = useState(initialData?.summary ?? "");
  const [publishStatus, setPublishStatus] = useState<PublishStatus>(
    initialData?.publishStatus ?? "PUBLISHED",
  );
  const [sourceType, setSourceType] = useState<SourceType>(
    initialData?.sourceType ?? "OFFICIAL",
  );
  const [sourceUrl, setSourceUrl] = useState(initialData?.sourceUrl ?? "");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("PRACTICAL");
  const [pricingModel, setPricingModel] = useState<PricingModel>("FREEMIUM");
  const [markdownBody, setMarkdownBody] = useState("");
  const [promptContent, setPromptContent] = useState("");
  const [toolKind, setToolKind] = useState<ToolKind>("TOOL");
  const [providerName, setProviderName] = useState("");
  const [pricingSummary, setPricingSummary] = useState("");
  const [koreanSupport, setKoreanSupport] = useState<KoreanSupportLevel>("FULL");
  const [keyPointsRaw, setKeyPointsRaw] = useState("");
  const [workImpact, setWorkImpact] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const tagSlugs = tagsRaw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const payload: AdminContentCreatePayload = {
      type,
      title: title.trim(),
      summary: summary.trim(),
      publishStatus,
      sourceType,
      sourceUrl: sourceUrl.trim(),
      tagSlugs,
    };

    if (type === "GUIDE") {
      payload.difficulty = difficulty;
      payload.pricingModel = pricingModel;
      payload.markdownBody = markdownBody.trim();
      if (promptContent.trim()) {
        payload.prompts = [
          {
            title: "기본 프롬프트",
            content: promptContent.trim(),
            variables: [],
          },
        ];
      }
    } else if (type === "TOOL") {
      payload.toolKind = toolKind;
      payload.providerName = providerName.trim();
      payload.officialUrl = sourceUrl.trim();
      payload.pricingModel = pricingModel;
      payload.hasFreePlan = pricingModel !== "PAID";
      payload.pricingSummary = pricingSummary.trim();
      payload.koreanSupport = koreanSupport;
    } else if (type === "NEWS") {
      payload.keyPoints = keyPointsRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);
      payload.workImpact = workImpact.trim();
    }

    await onSubmit(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "콘텐츠 수정" : "새 콘텐츠 수동 작성"}
          </DialogTitle>
          <DialogDescription>
            가이드, 도구·모델, AI 소식을 직접 등록하거나 수정합니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FieldGroup label="유형" required>
              <Select
                value={type}
                onValueChange={(v) => setType(v as ContentType)}
                disabled={Boolean(initialData)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GUIDE">업무 가이드</SelectItem>
                  <SelectItem value="TOOL">도구·모델</SelectItem>
                  <SelectItem value="NEWS">AI 소식</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>

            <FieldGroup label="발행 상태" required>
              <Select
                value={publishStatus}
                onValueChange={(v) => setPublishStatus(v as PublishStatus)}
              >
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
            </FieldGroup>

            <FieldGroup label="출처 유형" required>
              <Select
                value={sourceType}
                onValueChange={(v) => setSourceType(v as SourceType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OFFICIAL">공식</SelectItem>
                  <SelectItem value="MEDIA">전문 미디어</SelectItem>
                  <SelectItem value="COMMUNITY">커뮤니티</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>
          </div>

          <FieldGroup htmlFor="content-title" label="제목" required>
            <Input
              id="content-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 회의록 3분 요약 실무 가이드"
              required
            />
          </FieldGroup>

          <FieldGroup htmlFor="content-summary" label="요약" required>
            <Textarea
              id="content-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="핵심 결론과 활용 대상을 1~2줄로 작성하세요."
              required
            />
          </FieldGroup>

          <FieldGroup htmlFor="content-source-url" label="원문/공식 출처 URL" required>
            <Input
              id="content-source-url"
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </FieldGroup>

          {type === "GUIDE" ? (
            <div className="flex flex-col gap-3 rounded-md border border-border bg-muted/30 p-3">
              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="난이도">
                  <Select
                    value={difficulty}
                    onValueChange={(v) => setDifficulty(v as DifficultyLevel)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">입문</SelectItem>
                      <SelectItem value="PRACTICAL">실무</SelectItem>
                      <SelectItem value="ADVANCED">응용</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>
                <FieldGroup label="과금 형태">
                  <Select
                    value={pricingModel}
                    onValueChange={(v) => setPricingModel(v as PricingModel)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE">무료</SelectItem>
                      <SelectItem value="FREEMIUM">무료+유료</SelectItem>
                      <SelectItem value="PAID">유료</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>
              </div>
              <FieldGroup htmlFor="guide-md" label="본문 (Markdown)">
                <Textarea
                  id="guide-md"
                  value={markdownBody}
                  onChange={(e) => setMarkdownBody(e.target.value)}
                  placeholder="## 1단계..."
                />
              </FieldGroup>
              <FieldGroup htmlFor="guide-prompt" label="프롬프트 블록">
                <Textarea
                  id="guide-prompt"
                  value={promptContent}
                  onChange={(e) => setPromptContent(e.target.value)}
                  placeholder="다음 [회의록]을 요약해줘."
                />
              </FieldGroup>
            </div>
          ) : null}

          {type === "TOOL" ? (
            <div className="flex flex-col gap-3 rounded-md border border-border bg-muted/30 p-3">
              <div className="grid grid-cols-3 gap-3">
                <FieldGroup label="구분">
                  <Select
                    value={toolKind}
                    onValueChange={(v) => setToolKind(v as ToolKind)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TOOL">AI 도구</SelectItem>
                      <SelectItem value="MODEL">AI 모델</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>
                <FieldGroup htmlFor="tool-provider" label="제공사">
                  <Input
                    id="tool-provider"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    placeholder="OpenAI"
                  />
                </FieldGroup>
                <FieldGroup label="한국어 지원">
                  <Select
                    value={koreanSupport}
                    onValueChange={(v) => setKoreanSupport(v as KoreanSupportLevel)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL">완전 지원</SelectItem>
                      <SelectItem value="PARTIAL">부분 지원</SelectItem>
                      <SelectItem value="NONE">미지원</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>
              </div>
              <FieldGroup htmlFor="tool-pricing" label="요금·무료 한도 요약">
                <Input
                  id="tool-pricing"
                  value={pricingSummary}
                  onChange={(e) => setPricingSummary(e.target.value)}
                  placeholder="무료 플랜 제공 / Plus 월 $20"
                />
              </FieldGroup>
            </div>
          ) : null}

          {type === "NEWS" ? (
            <div className="flex flex-col gap-3 rounded-md border border-border bg-muted/30 p-3">
              <FieldGroup htmlFor="news-keypoints" label="핵심 3줄 요약 (줄바꿈 구분)">
                <Textarea
                  id="news-keypoints"
                  value={keyPointsRaw}
                  onChange={(e) => setKeyPointsRaw(e.target.value)}
                  placeholder={"1. 핵심 변화...\n2. 적용 대상...\n3. 요금/일정..."}
                />
              </FieldGroup>
              <FieldGroup htmlFor="news-impact" label="실무 영향">
                <Textarea
                  id="news-impact"
                  value={workImpact}
                  onChange={(e) => setWorkImpact(e.target.value)}
                  placeholder="실무 직장인에게 어떤 변화가 있는지 요약하세요."
                />
              </FieldGroup>
            </div>
          ) : null}

          <FieldGroup htmlFor="content-tags" label="태그 (쉼표 구분)">
            <Input
              id="content-tags"
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              placeholder="회의록, 요약, chatgpt"
            />
          </FieldGroup>

          <DialogFooter>
            <Button
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
