"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { ReportReason, ReportStatus } from "@/shared/types";
import {
  Badge,
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  ErrorState,
  FieldGroup,
  FilterBar,
  Textarea,
  type DataTableColumn,
} from "@/shared/ui";
import type { AdminReportItem } from "../api/admin-reports.api";
import {
  useAdminReportsQuery,
  useUpdateAdminReportMutation,
} from "../model/useAdminReports";

const REASON_LABEL: Record<ReportReason, string> = {
  PRICING_CHANGED: "요금 변경",
  BROKEN_LINK: "링크 깨짐",
  CONTENT_ERROR: "내용 오류",
  OUTDATED_OTHER: "오래된 정보/기타",
};

const STATUS_LABEL: Record<ReportStatus, string> = {
  OPEN: "접수됨",
  IN_PROGRESS: "확인 중",
  RESOLVED: "해결됨",
  DISMISSED: "반려됨",
};

export const AdminReportsManager = () => {
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "">("");
  const [selected, setSelected] = useState<AdminReportItem | null>(null);
  const [nextStatus, setNextStatus] = useState<ReportStatus>("RESOLVED");
  const [resolutionMemo, setResolutionMemo] = useState("");

  const reportsQuery = useAdminReportsQuery(statusFilter || undefined);
  const updateMutation = useUpdateAdminReportMutation();

  const openModal = (item: AdminReportItem) => {
    setSelected(item);
    setNextStatus(item.status === "OPEN" ? "RESOLVED" : item.status);
    setResolutionMemo(item.resolutionMemo ?? "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    try {
      await updateMutation.mutateAsync({
        id: selected.id,
        status: nextStatus,
        resolutionMemo: resolutionMemo.trim() || undefined,
      });
      setSelected(null);
      toast.success("제보 처리 상태가 업데이트되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "처리에 실패했습니다.");
    }
  };

  const rows = reportsQuery.data?.data ?? [];

  const columns: DataTableColumn<AdminReportItem>[] = [
    {
      key: "content",
      header: "콘텐츠 / 사유",
      cell: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-foreground">
            {row.contentTitle ?? row.contentId}
          </span>
          <span className="text-xs text-muted-foreground">
            {REASON_LABEL[row.reason]} · {row.detail}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "상태",
      cell: (row) => (
        <Badge
          variant={
            row.status === "RESOLVED"
              ? "valid"
              : row.status === "OPEN"
                ? "review"
                : "outline"
          }
        >
          {STATUS_LABEL[row.status]}
        </Badge>
      ),
    },
    {
      key: "action",
      header: "처리",
      cell: (row) => (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => openModal(row)}
        >
          상태 변경
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <FilterBar>
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { value: "", label: "전체" },
              { value: "OPEN", label: "접수됨" },
              { value: "IN_PROGRESS", label: "확인 중" },
              { value: "RESOLVED", label: "해결됨" },
              { value: "DISMISSED", label: "반려됨" },
            ] as const
          ).map((opt) => (
            <Button
              key={opt.label}
              type="button"
              size="sm"
              variant={statusFilter === opt.value ? "default" : "outline"}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </FilterBar>

      {reportsQuery.isError ? (
        <ErrorState
          title="오류 제보 목록을 불러오지 못했습니다."
          description="잠시 후 다시 시도해 주세요."
        />
      ) : rows.length === 0 && !reportsQuery.isLoading ? (
        <EmptyState
          title="접수된 제보가 없습니다."
          description="선택한 상태의 오류·최신화 제보가 없습니다."
        />
      ) : (
        <DataTable<AdminReportItem>
          columns={columns}
          rows={rows}
          getRowKey={(r) => r.id}
          emptyState={<p className="text-sm text-muted-foreground">제보 없음</p>}
        />
      )}

      <Dialog open={Boolean(selected)} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>제보 상태 처리</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <FieldGroup htmlFor="admin-report-status" label="처리 상태">
              <select
                id="admin-report-status"
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value as ReportStatus)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="OPEN">접수됨</option>
                <option value="IN_PROGRESS">확인 중</option>
                <option value="RESOLVED">해결됨</option>
                <option value="DISMISSED">반려됨</option>
              </select>
            </FieldGroup>

            <FieldGroup htmlFor="admin-report-memo" label="처리 메모">
              <Textarea
                id="admin-report-memo"
                rows={3}
                value={resolutionMemo}
                onChange={(e) => setResolutionMemo(e.target.value)}
                placeholder="조치 내역 또는 반려 사유"
              />
            </FieldGroup>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelected(null)}
              >
                취소
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "저장 중..." : "저장"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
