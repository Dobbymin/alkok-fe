"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
} from "@alkok/ui";
import type { SourceItem, SourcePayload } from "../api/admin-sources.api";
import {
  sourceFormSchema,
  type SourceFormValues,
} from "../model/source-form.schema";

interface SourceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: SourceItem | null;
  onSubmit: (payload: SourcePayload) => Promise<void>;
  isPending?: boolean;
}

export const SourceFormDialog = ({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending = false,
}: SourceFormDialogProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SourceFormValues>({
    resolver: zodResolver(sourceFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: initialData?.name ?? "",
      feedUrl: initialData?.feedUrl ?? "",
      sourceType: initialData?.sourceType ?? "OFFICIAL",
      fetchIntervalHours: initialData?.fetchIntervalHours ?? 12,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: initialData?.name ?? "",
      feedUrl: initialData?.feedUrl ?? "",
      sourceType: initialData?.sourceType ?? "OFFICIAL",
      fetchIntervalHours: initialData?.fetchIntervalHours ?? 12,
    });
  }, [open, initialData, reset]);

  const handleValidSubmit = async (values: SourceFormValues) => {
    await onSubmit({
      name: values.name.trim(),
      feedUrl: values.feedUrl.trim(),
      sourceType: values.sourceType,
      fetchIntervalHours: values.fetchIntervalHours,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "수집 출처 수정" : "새 수집 출처 등록"}
          </DialogTitle>
          <DialogDescription>
            화이트리스트 RSS/Atom 또는 공식 API 피드 URL을 등록합니다.
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          onSubmit={handleSubmit(handleValidSubmit)}
          className="flex flex-col gap-4"
        >
          <FieldGroup
            htmlFor="source-name"
            label="출처명"
            required
            error={errors.name?.message}
            errorId="source-name-error"
          >
            <Input
              id="source-name"
              placeholder="예: OpenAI News"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "source-name-error" : undefined}
              {...register("name")}
            />
          </FieldGroup>

          <FieldGroup
            htmlFor="source-url"
            label="Feed URL"
            required
            error={errors.feedUrl?.message}
            errorId="source-url-error"
          >
            <Input
              id="source-url"
              type="url"
              placeholder="https://openai.com/news/rss.xml"
              aria-invalid={Boolean(errors.feedUrl)}
              aria-describedby={errors.feedUrl ? "source-url-error" : undefined}
              {...register("feedUrl")}
            />
          </FieldGroup>

          <div className="grid grid-cols-2 gap-3">
            <FieldGroup
              htmlFor="source-type"
              label="출처 유형"
              required
              error={errors.sourceType?.message}
            >
              <Controller
                name="sourceType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="source-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OFFICIAL">OFFICIAL (공식)</SelectItem>
                      <SelectItem value="MEDIA">MEDIA (전문 미디어)</SelectItem>
                      <SelectItem value="COMMUNITY">COMMUNITY (커뮤니티)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldGroup>

            <FieldGroup
              htmlFor="source-interval"
              label="수집 주기 (시간)"
              required
              error={errors.fetchIntervalHours?.message}
              errorId="source-interval-error"
            >
              <Input
                id="source-interval"
                type="number"
                min={1}
                max={168}
                aria-invalid={Boolean(errors.fetchIntervalHours)}
                aria-describedby={
                  errors.fetchIntervalHours ? "source-interval-error" : undefined
                }
                {...register("fetchIntervalHours", { valueAsNumber: true })}
              />
            </FieldGroup>
          </div>

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
