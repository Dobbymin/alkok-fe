"use client";

import { AlertTriangle, Link2, Plus, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  useCreateExternalUrlMutation,
  usePreviewExternalUrlMutation,
  type VaultFolder,
  type VaultPreviewResult,
} from "@/entities/vault";
import { ApiError } from "@alkok/core";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FieldGroup,
  Input,
  Textarea,
} from "@alkok/ui";

export interface ExternalUrlModalProps {
  folders: VaultFolder[];
  defaultFolderId?: string;
}

export const ExternalUrlModal = ({
  folders,
  defaultFolderId = "",
}: ExternalUrlModalProps) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [folderId, setFolderId] = useState(defaultFolderId);
  const [memo, setMemo] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [previewed, setPreviewed] = useState<VaultPreviewResult | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [duplicateUrl, setDuplicateUrl] = useState(false);

  const previewMutation = usePreviewExternalUrlMutation();
  const createMutation = useCreateExternalUrlMutation();

  const resetForm = () => {
    setUrl("");
    setTitle("");
    setSummary("");
    setThumbnailUrl(null);
    setFolderId(defaultFolderId);
    setMemo("");
    setTagsText("");
    setPreviewed(null);
    setErrorBanner(null);
    setDuplicateUrl(false);
  };

  const handlePreview = async () => {
    if (!url.trim()) return;
    setErrorBanner(null);
    setDuplicateUrl(false);
    try {
      const res = await previewMutation.mutateAsync(url.trim());
      const data = res.data;
      setPreviewed(data);
      setTitle(data.title ?? "");
      setSummary(data.description ?? "");
      setThumbnailUrl(data.thumbnailUrl ?? null);
    } catch (err) {
      if (err instanceof ApiError && err.errorCode === "SSRF_BLOCKED_URL") {
        setErrorBanner("보안 정책상 허용되지 않는 내부/로컬 URL입니다.");
      } else if (
        err instanceof ApiError &&
        err.errorCode === "VAULT_DUPLICATE_URL"
      ) {
        setDuplicateUrl(true);
        setErrorBanner("이미 보관함에 저장된 URL입니다.");
      } else {
        setErrorBanner(
          err instanceof Error
            ? err.message
            : "URL 미리보기를 불러오지 못했습니다.",
        );
      }
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setErrorBanner(null);
    setDuplicateUrl(false);
    const tagNames = tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await createMutation.mutateAsync({
        url: url.trim(),
        title: title.trim() || url.trim(),
        summary: summary.trim() || undefined,
        thumbnailUrl,
        folderId: folderId || null,
        memo: memo.trim() || undefined,
        tagNames,
      });
      toast.success("외부 링크가 보관함에 저장되었습니다.");
      setOpen(false);
      resetForm();
    } catch (err) {
      if (err instanceof ApiError && err.errorCode === "VAULT_DUPLICATE_URL") {
        setDuplicateUrl(true);
        setErrorBanner("이미 보관함에 저장된 URL입니다.");
      } else if (
        err instanceof ApiError &&
        err.errorCode === "SSRF_BLOCKED_URL"
      ) {
        setErrorBanner("보안 정책상 허용되지 않는 내부/로컬 URL입니다.");
      } else {
        setErrorBanner(
          err instanceof Error ? err.message : "외부 URL 저장에 실패했습니다.",
        );
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" aria-hidden="true" />
          외부 URL 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>외부 링크 보관하기</DialogTitle>
          <DialogDescription>
            외부 아티클, AI 도구, 참고 링크를 메타데이터와 함께 보관합니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FieldGroup htmlFor="vault-ext-url" label="URL" required>
            <div className="flex gap-2">
              <Input
                id="vault-ext-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                wrapperClassName="flex-1"
                startIcon={<Link2 className="h-4 w-4" />}
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePreview}
                disabled={previewMutation.isPending || !url.trim()}
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {previewMutation.isPending ? "조회 중..." : "미리보기"}
              </Button>
            </div>
          </FieldGroup>

          {errorBanner ? (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive"
            >
              <AlertTriangle className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <p className="font-medium">{errorBanner}</p>
                {duplicateUrl ? (
                  <p className="text-muted-foreground">
                    보관함 목록에서 기존 저장 항목을 검색해 확인할 수 있습니다.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {previewed?.fallback ? (
            <div className="rounded-md border border-status-review-border bg-status-review-bg p-3 text-xs text-status-review-fg">
              메타데이터를 자동으로 가져오지 못했습니다. 제목과 설명을 직접 입력해 주세요.
            </div>
          ) : null}

          <FieldGroup htmlFor="vault-ext-title" label="제목" required>
            <Input
              id="vault-ext-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="링크 제목"
              required
            />
          </FieldGroup>

          <FieldGroup htmlFor="vault-ext-summary" label="설명">
            <Textarea
              id="vault-ext-summary"
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="간단한 요약 (선택)"
            />
          </FieldGroup>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FieldGroup htmlFor="vault-ext-folder" label="폴더">
              <select
                id="vault-ext-folder"
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground"
              >
                <option value="">미분류</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </FieldGroup>

            <FieldGroup htmlFor="vault-ext-tags" label="태그 (쉼표 구분)">
              <Input
                id="vault-ext-tags"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="예: 리서치, 프롬프트"
              />
            </FieldGroup>
          </div>

          <FieldGroup htmlFor="vault-ext-memo" label="메모">
            <Input
              id="vault-ext-memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="나중에 참고할 메모"
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              취소
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending || duplicateUrl}
            >
              {createMutation.isPending ? "저장 중..." : "보관함에 저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
