"use client";

import { useState, type FormEvent } from "react";
import type { SourceType } from "@/shared/types";
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
} from "@/shared/ui";
import type { SourceItem, SourcePayload } from "../api/admin-sources.api";

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
  const [name, setName] = useState(initialData?.name ?? "");
  const [feedUrl, setFeedUrl] = useState(initialData?.feedUrl ?? "");
  const [sourceType, setSourceType] = useState<SourceType>(
    initialData?.sourceType ?? "OFFICIAL",
  );
  const [fetchIntervalHours, setFetchIntervalHours] = useState(
    String(initialData?.fetchIntervalHours ?? 12),
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name: name.trim(),
      feedUrl: feedUrl.trim(),
      sourceType,
      fetchIntervalHours: Math.max(1, Number(fetchIntervalHours) || 12),
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup htmlFor="source-name" label="출처명" required>
            <Input
              id="source-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: OpenAI News"
              required
            />
          </FieldGroup>

          <FieldGroup htmlFor="source-url" label="Feed URL" required>
            <Input
              id="source-url"
              type="url"
              value={feedUrl}
              onChange={(e) => setFeedUrl(e.target.value)}
              placeholder="https://openai.com/news/rss.xml"
              required
            />
          </FieldGroup>

          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="출처 유형" required>
              <Select
                value={sourceType}
                onValueChange={(v) => setSourceType(v as SourceType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OFFICIAL">OFFICIAL (공식)</SelectItem>
                  <SelectItem value="MEDIA">MEDIA (전문 미디어)</SelectItem>
                  <SelectItem value="COMMUNITY">COMMUNITY (커뮤니티)</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>

            <FieldGroup htmlFor="source-interval" label="수집 주기 (시간)" required>
              <Input
                id="source-interval"
                type="number"
                min={1}
                max={168}
                value={fetchIntervalHours}
                onChange={(e) => setFetchIntervalHours(e.target.value)}
                required
              />
            </FieldGroup>
          </div>

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
