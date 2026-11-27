"use client";

import { AlertTriangle, Check, ExternalLink, Save, XCircle } from "lucide-react";
import { useState } from "react";
import type { ContentType, SourceType } from "@alkok/core";
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  FieldGroup,
  Input,
  Skeleton,
  SplitPane,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@alkok/ui";

export interface AdminReviewItem {
  id: string;
  type: ContentType;
  title: string;
  summary: string;
  sourceType: SourceType;
  sourceUrl: string;
  sourceName?: string | null;
  rawTextExcerpt: string;
  evidenceNotes: string[];
  unverifiedFields: string[];
  tags: string[];
  workImpact?: string | null;
  markdownBody?: string | null;
  pricingSummary?: string | null;
  overview?: string | null;
  compatibleAgents?: string[];
  installPrompt?: string | null;
  skillMdPreview?: string | null;
}

export interface AdminReviewDraftPayload {
  title: string;
  summary: string;
  tags: string[];
  workImpact?: string;
  markdownBody?: string;
  pricingSummary?: string;
  overview?: string;
  installPrompt?: string;
  skillMdPreview?: string;
}

export interface AdminReviewSplitViewProps {
  item: AdminReviewItem | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isSubmitting?: boolean;
  onApprove: (payload: AdminReviewDraftPayload) => void | Promise<void>;
  onSaveDraft: (payload: AdminReviewDraftPayload) => void | Promise<void>;
  onReject: () => void | Promise<void>;
}

const SourcePanel = ({ item }: { item: AdminReviewItem }) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
      <div className="flex items-center gap-2">
        <Badge variant="official">{item.sourceType}</Badge>
        <span className="text-xs font-medium text-muted-foreground">
          {item.sourceName ?? "외부 출처"}
        </span>
      </div>
      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        원문 열기
        <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
      </a>
    </div>

    {item.unverifiedFields.length > 0 ? (
      <div className="rounded-md border border-status-review-border bg-status-review-bg p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-status-review-fg">
          <AlertTriangle className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          <span>[확인 필요] 미검증 항목</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {item.unverifiedFields.map((field) => (
            <Badge key={field} variant="review">
              {field}
            </Badge>
          ))}
        </div>
      </div>
    ) : null}

    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-foreground">AI 추출 근거(Evidence)</h3>
      {item.evidenceNotes.length > 0 ? (
        <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
          {item.evidenceNotes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">근거 메모 없음</p>
      )}
    </div>

    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-foreground">원문 발췌(RawDocument)</h3>
      <div className="max-h-80 overflow-y-auto rounded-md border border-border bg-muted/40 p-3 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
        {item.rawTextExcerpt}
      </div>
    </div>
  </div>
);

const DraftEditorPanel = ({
  item,
  isSubmitting,
  onApprove,
  onSaveDraft,
  onReject,
}: {
  item: AdminReviewItem;
  isSubmitting?: boolean;
  onApprove: (payload: AdminReviewDraftPayload) => void | Promise<void>;
  onSaveDraft: (payload: AdminReviewDraftPayload) => void | Promise<void>;
  onReject: () => void | Promise<void>;
}) => {
  const [title, setTitle] = useState(item.title);
  const [summary, setSummary] = useState(item.summary);
  const [tagsRaw, setTagsRaw] = useState(item.tags.join(", "));
  const [workImpact, setWorkImpact] = useState(item.workImpact ?? "");
  const [markdownBody, setMarkdownBody] = useState(item.markdownBody ?? "");
  const [pricingSummary, setPricingSummary] = useState(item.pricingSummary ?? "");
  const [overview, setOverview] = useState(item.overview ?? "");
  const [installPrompt, setInstallPrompt] = useState(item.installPrompt ?? "");
  const [skillMdPreview, setSkillMdPreview] = useState(item.skillMdPreview ?? "");

  const buildPayload = (): AdminReviewDraftPayload => ({
    title: title.trim(),
    summary: summary.trim(),
    tags: tagsRaw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
    workImpact: workImpact.trim() || undefined,
    markdownBody: markdownBody.trim() || undefined,
    pricingSummary: pricingSummary.trim() || undefined,
    overview: overview.trim() || undefined,
    installPrompt: installPrompt.trim() || undefined,
    skillMdPreview: skillMdPreview.trim() || undefined,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-xs font-semibold text-foreground">
          AI 한국어 초안 편집
        </span>
        <Badge variant="secondary">{item.type}</Badge>
      </div>

      <FieldGroup htmlFor={`review-title-${item.id}`} label="제목" required>
        <Input
          id={`review-title-${item.id}`}
          inputSize="sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FieldGroup>

      <FieldGroup htmlFor={`review-summary-${item.id}`} label="요약" required>
        <Textarea
          id={`review-summary-${item.id}`}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="min-h-20 text-xs"
        />
      </FieldGroup>

      {item.type === "NEWS" ? (
        <FieldGroup htmlFor={`review-impact-${item.id}`} label="실무 영향">
          <Textarea
            id={`review-impact-${item.id}`}
            value={workImpact}
            onChange={(e) => setWorkImpact(e.target.value)}
            className="min-h-20 text-xs"
          />
        </FieldGroup>
      ) : null}

      {item.type === "GUIDE" ? (
        <FieldGroup htmlFor={`review-md-${item.id}`} label="가이드 본문 (Markdown)">
          <Textarea
            id={`review-md-${item.id}`}
            value={markdownBody}
            onChange={(e) => setMarkdownBody(e.target.value)}
            className="min-h-28 font-mono text-xs"
          />
        </FieldGroup>
      ) : null}

      {item.type === "TOOL" ? (
        <FieldGroup htmlFor={`review-pricing-${item.id}`} label="요금·무료 한도">
          <Input
            id={`review-pricing-${item.id}`}
            inputSize="sm"
            value={pricingSummary}
            onChange={(e) => setPricingSummary(e.target.value)}
          />
        </FieldGroup>
      ) : null}

      {item.type === "SKILL" ? (
        <div className="flex flex-col gap-3">
          {item.compatibleAgents && item.compatibleAgents.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                호환 에이전트:
              </span>
              {item.compatibleAgents.map((agent) => (
                <Badge key={agent} variant="outline">
                  {agent}
                </Badge>
              ))}
            </div>
          ) : null}
          <FieldGroup htmlFor={`review-overview-${item.id}`} label="스킬·플러그인 개요">
            <Textarea
              id={`review-overview-${item.id}`}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="min-h-20 text-xs"
            />
          </FieldGroup>
          <FieldGroup htmlFor={`review-install-${item.id}`} label="자연어 설치 요청">
            <Textarea
              id={`review-install-${item.id}`}
              value={installPrompt}
              onChange={(e) => setInstallPrompt(e.target.value)}
              className="min-h-16 font-mono text-xs"
            />
          </FieldGroup>
          <FieldGroup htmlFor={`review-skillmd-${item.id}`} label="SKILL.md 미리보기">
            <Textarea
              id={`review-skillmd-${item.id}`}
              value={skillMdPreview}
              onChange={(e) => setSkillMdPreview(e.target.value)}
              className="min-h-24 font-mono text-xs"
            />
          </FieldGroup>
        </div>
      ) : null}

      <FieldGroup htmlFor={`review-tags-${item.id}`} label="태그 (쉼표 구분)">
        <Input
          id={`review-tags-${item.id}`}
          inputSize="sm"
          value={tagsRaw}
          onChange={(e) => setTagsRaw(e.target.value)}
        />
      </FieldGroup>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
        <Button
          variant="outline"
          size="sm"
          disabled={isSubmitting}
          onClick={() => onReject()}
        >
          <XCircle className="h-3.5 w-3.5 text-destructive" strokeWidth={1.75} aria-hidden="true" />
          반려
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={isSubmitting}
          onClick={() => onSaveDraft(buildPayload())}
        >
          <Save className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          임시 저장
        </Button>
        <Button
          size="sm"
          disabled={isSubmitting}
          onClick={() => onApprove(buildPayload())}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          승인·즉시 공개
        </Button>
      </div>
    </div>
  );
};

export const AdminReviewSplitView = ({
  item,
  isLoading = false,
  error = null,
  onRetry,
  isSubmitting = false,
  onApprove,
  onSaveDraft,
  onReject,
}: AdminReviewSplitViewProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (error) {
    return <ErrorState description={error} onRetry={onRetry} />;
  }

  if (!item) {
    return (
      <EmptyState
        title="검수할 항목을 선택해 주세요."
        description="좌측/상단 대기열에서 초안을 선택하면 원문 근거와 초안 에디터가 표시됩니다."
      />
    );
  }

  return (
    <div>
      {/* Desktop 50:50 Split */}
      <div className="hidden lg:block">
        <SplitPane
          left={<SourcePanel item={item} />}
          right={
            <DraftEditorPanel
              key={item.id}
              item={item}
              isSubmitting={isSubmitting}
              onApprove={onApprove}
              onSaveDraft={onSaveDraft}
              onReject={onReject}
            />
          }
        />
      </div>

      {/* Mobile Tab Switch */}
      <div className="lg:hidden">
        <Tabs defaultValue="draft" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="source">원문</TabsTrigger>
            <TabsTrigger value="draft">초안 편집</TabsTrigger>
          </TabsList>
          <TabsContent value="source" className="rounded-lg border border-border bg-card p-4">
            <SourcePanel item={item} />
          </TabsContent>
          <TabsContent value="draft" className="rounded-lg border border-border bg-card p-4">
            <DraftEditorPanel
              key={item.id}
              item={item}
              isSubmitting={isSubmitting}
              onApprove={onApprove}
              onSaveDraft={onSaveDraft}
              onReject={onReject}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
