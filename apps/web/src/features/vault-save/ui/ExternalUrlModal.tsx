"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Globe, Link2, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useCreateExternalUrlMutation,
  usePreviewExternalUrlMutation,
  type VaultFolder,
  type VaultPreviewResult,
} from "@/entities/vault";
import { ApiError, parseCommaSeparated } from "@alkok/core";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  toast,
} from "@alkok/ui";
import {
  externalUrlSchema,
  type ExternalUrlFormValues,
} from "../model/vault-save.schema";

const UNCLASSIFIED_FOLDER_VALUE = "__UNCLASSIFIED__";

export interface ExternalUrlModalProps {
  folders: VaultFolder[];
  defaultFolderId?: string;
}

export const ExternalUrlModal = ({
  folders,
  defaultFolderId = "",
}: ExternalUrlModalProps) => {
  const [open, setOpen] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [previewed, setPreviewed] = useState<VaultPreviewResult | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [duplicateUrl, setDuplicateUrl] = useState(false);

  const previewMutation = usePreviewExternalUrlMutation();
  const createMutation = useCreateExternalUrlMutation();

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ExternalUrlFormValues>({
    resolver: zodResolver(externalUrlSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      url: "",
      title: "",
      summary: "",
      folderId: defaultFolderId,
      tagsText: "",
      memo: "",
    },
  });

  const resetForm = () => {
    reset({
      url: "",
      title: "",
      summary: "",
      folderId: defaultFolderId,
      tagsText: "",
      memo: "",
    });
    setThumbnailUrl(null);
    setPreviewed(null);
    setErrorBanner(null);
    setDuplicateUrl(false);
  };

  const handlePreview = async () => {
    const valid = await trigger("url");
    if (!valid) return;
    const targetUrl = getValues("url").trim();
    setErrorBanner(null);
    setDuplicateUrl(false);
    try {
      const res = await previewMutation.mutateAsync(targetUrl);
      const data = res.data;
      setPreviewed(data);
      setValue("title", data.title ?? "", { shouldValidate: false });
      setValue("summary", data.description ?? "", { shouldValidate: false });
      setThumbnailUrl(data.thumbnailUrl ?? null);
    } catch (err) {
      if (err instanceof ApiError && err.errorCode === "SSRF_BLOCKED_URL") {
        const message = "보안 정책상 허용되지 않는 내부/로컬 URL입니다.";
        setErrorBanner(message);
        toast.error(message);
      } else if (
        err instanceof ApiError &&
        err.errorCode === "VAULT_DUPLICATE_URL"
      ) {
        const message = "이미 보관함에 저장된 URL입니다.";
        setDuplicateUrl(true);
        setErrorBanner(message);
        toast.error(message);
      } else {
        const message =
          err instanceof Error
            ? err.message
            : "URL 미리보기를 불러오지 못했습니다.";
        setErrorBanner(message);
        toast.error(message);
      }
    }
  };

  const onSave = async (values: ExternalUrlFormValues) => {
    setErrorBanner(null);
    setDuplicateUrl(false);
    const tagNames = parseCommaSeparated(values.tagsText);

    try {
      await createMutation.mutateAsync({
        url: values.url.trim(),
        title: values.title.trim(),
        summary: values.summary.trim() || undefined,
        thumbnailUrl,
        folderId: values.folderId || null,
        memo: values.memo.trim() || undefined,
        tagNames,
      });
      toast.success("외부 링크가 보관함에 저장되었습니다.");
      setOpen(false);
      resetForm();
    } catch (err) {
      if (err instanceof ApiError && err.errorCode === "VAULT_DUPLICATE_URL") {
        const message = "이미 보관함에 저장된 URL입니다.";
        setDuplicateUrl(true);
        setErrorBanner(message);
        toast.error(message);
      } else if (
        err instanceof ApiError &&
        err.errorCode === "SSRF_BLOCKED_URL"
      ) {
        const message = "보안 정책상 허용되지 않는 내부/로컬 URL입니다.";
        setErrorBanner(message);
        toast.error(message);
      } else {
        const message =
          err instanceof Error ? err.message : "외부 URL 저장에 실패했습니다.";
        setErrorBanner(message);
        toast.error(message);
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

        <form noValidate onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4">
          <FieldGroup
            htmlFor="vault-ext-url"
            label="URL"
            required
            error={errors.url?.message}
            errorId="vault-ext-url-error"
          >
            <div className="flex gap-2">
              <Input
                id="vault-ext-url"
                type="url"
                placeholder="https://example.com/article"
                wrapperClassName="flex-1"
                startIcon={<Link2 className="h-4 w-4" />}
                aria-invalid={Boolean(errors.url)}
                aria-describedby={errors.url ? "vault-ext-url-error" : undefined}
                {...register("url")}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePreview}
                disabled={previewMutation.isPending}
              >
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
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

          <FieldGroup
            htmlFor="vault-ext-title"
            label="제목"
            required
            error={errors.title?.message}
            errorId="vault-ext-title-error"
          >
            <Input
              id="vault-ext-title"
              placeholder="링크 제목"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "vault-ext-title-error" : undefined}
              {...register("title")}
            />
          </FieldGroup>

          <FieldGroup
            htmlFor="vault-ext-summary"
            label="설명"
            error={errors.summary?.message}
            errorId="vault-ext-summary-error"
          >
            <Textarea
              id="vault-ext-summary"
              rows={2}
              placeholder="간단한 요약 (선택)"
              aria-invalid={Boolean(errors.summary)}
              aria-describedby={
                errors.summary ? "vault-ext-summary-error" : undefined
              }
              {...register("summary")}
            />
          </FieldGroup>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FieldGroup htmlFor="vault-ext-folder" label="폴더">
              <Controller
                name="folderId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || UNCLASSIFIED_FOLDER_VALUE}
                    onValueChange={(v) =>
                      field.onChange(v === UNCLASSIFIED_FOLDER_VALUE ? "" : v)
                    }
                  >
                    <SelectTrigger
                      id="vault-ext-folder"
                      className="h-9 bg-background text-xs"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UNCLASSIFIED_FOLDER_VALUE}>미분류</SelectItem>
                      {folders.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldGroup>

            <FieldGroup
              htmlFor="vault-ext-tags"
              label="태그 (쉼표 구분)"
              error={errors.tagsText?.message}
              errorId="vault-ext-tags-error"
            >
              <Input
                id="vault-ext-tags"
                placeholder="예: 리서치, 프롬프트"
                aria-invalid={Boolean(errors.tagsText)}
                aria-describedby={
                  errors.tagsText ? "vault-ext-tags-error" : undefined
                }
                {...register("tagsText")}
              />
            </FieldGroup>
          </div>

          <FieldGroup
            htmlFor="vault-ext-memo"
            label="메모"
            error={errors.memo?.message}
            errorId="vault-ext-memo-error"
          >
            <Input
              id="vault-ext-memo"
              placeholder="나중에 참고할 메모"
              aria-invalid={Boolean(errors.memo)}
              aria-describedby={errors.memo ? "vault-ext-memo-error" : undefined}
              {...register("memo")}
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
