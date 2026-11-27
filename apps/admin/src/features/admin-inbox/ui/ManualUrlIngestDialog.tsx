"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
} from "@alkok/ui";
import {
  manualIngestSchema,
  type ManualIngestFormValues,
} from "../model/manual-ingest.schema";

interface ManualUrlIngestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (url: string) => Promise<void>;
  isPending?: boolean;
}

export const ManualUrlIngestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
}: ManualUrlIngestDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualIngestFormValues>({
    resolver: zodResolver(manualIngestSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { url: "" },
  });

  useEffect(() => {
    if (!open) reset({ url: "" });
  }, [open, reset]);

  const handleValidSubmit = async (values: ManualIngestFormValues) => {
    await onSubmit(values.url.trim());
    reset({ url: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>URL 수동 투입</DialogTitle>
          <DialogDescription>
            공식 블로그나 문서 URL을 입력하면 원문을 추출해 AI 한국어 초안을 생성합니다.
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          onSubmit={handleSubmit(handleValidSubmit)}
          className="flex flex-col gap-4"
        >
          <FieldGroup
            htmlFor="manual-ingest-url"
            label="원문 URL"
            required
            error={errors.url?.message}
            errorId="manual-ingest-url-error"
          >
            <Input
              id="manual-ingest-url"
              type="url"
              placeholder="https://openai.com/index/..."
              aria-invalid={Boolean(errors.url)}
              aria-describedby={
                errors.url ? "manual-ingest-url-error" : undefined
              }
              {...register("url")}
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
              {isPending ? "수집 요청 중..." : "수집·초안 생성"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
