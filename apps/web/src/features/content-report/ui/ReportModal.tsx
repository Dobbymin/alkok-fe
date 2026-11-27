"use client";

import { useMutation } from "@tanstack/react-query";
import { Flag } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { ReportReason } from "@alkok/core";
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
} from "@alkok/ui";
import { reportApi } from "../api/report.api";

const REASON_OPTIONS: Array<{ value: ReportReason; label: string }> = [
  { value: "PRICING_CHANGED", label: "요금·무료 한도 변경" },
  { value: "BROKEN_LINK", label: "링크 깨짐 / 페이지 이동 불가" },
  { value: "CONTENT_ERROR", label: "기능·내용 오류" },
  { value: "OUTDATED_OTHER", label: "오래된 정보 / 기타" },
];

export interface ReportModalProps {
  contentId: string;
  contentTitle?: string;
}

export const ReportModal = ({ contentId, contentTitle }: ReportModalProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>("PRICING_CHANGED");
  const [detail, setDetail] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [website, setWebsite] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      reportApi.submitReport(contentId, {
        reason,
        detail: detail.trim(),
        reporterEmail: reporterEmail.trim() || undefined,
        website: website || undefined,
      }),
    onSuccess: () => {
      toast.success("오류·최신화 제보가 접수되었습니다. 감사합니다.");
      setOpen(false);
      setReason("PRICING_CHANGED");
      setDetail("");
      setReporterEmail("");
      setWebsite("");
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "제보 접수에 실패했습니다.",
      );
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!detail.trim()) return;
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm">
          <Flag className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          오류·최신화 제보
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>오류·최신화 제보</DialogTitle>
          <DialogDescription>
            {contentTitle
              ? `"${contentTitle}"의 변경된 정보나 오류를 알려주세요.`
              : "변경된 요금·링크 오류·잘못된 정보를 알려주세요."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup
            htmlFor={`report-reason-${contentId}`}
            label="제보 사유"
            required
          >
            <Select
              value={reason}
              onValueChange={(v) => setReason(v as ReportReason)}
            >
              <SelectTrigger
                id={`report-reason-${contentId}`}
                className="h-9 bg-background text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REASON_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldGroup>

          <FieldGroup
            htmlFor={`report-detail-${contentId}`}
            label="상세 내용"
            required
          >
            <Textarea
              id={`report-detail-${contentId}`}
              rows={3}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="예: 무료 플랜이 월 10회로 변경되었습니다."
              required
            />
          </FieldGroup>

          <FieldGroup
            htmlFor={`report-email-${contentId}`}
            label="회신 이메일 (선택)"
          >
            <Input
              id={`report-email-${contentId}`}
              type="email"
              value={reporterEmail}
              onChange={(e) => setReporterEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </FieldGroup>

          {/* Honeypot field for bot filtering */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor={`report-website-${contentId}`}>Website</label>
            <input
              id={`report-website-${contentId}`}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

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
              disabled={mutation.isPending || !detail.trim()}
            >
              {mutation.isPending ? "접수 중..." : "제보 제출"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
