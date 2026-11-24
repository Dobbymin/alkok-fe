"use client";

import { useState, type FormEvent } from "react";
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
} from "@/shared/ui";

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
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    await onSubmit(url.trim());
    setUrl("");
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup htmlFor="manual-ingest-url" label="원문 URL" required>
            <Input
              id="manual-ingest-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://openai.com/index/..."
              required
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
              {isPending ? "수집 요청 중..." : "수집·초안 생성"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
