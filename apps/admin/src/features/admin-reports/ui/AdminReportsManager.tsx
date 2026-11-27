"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { ReportReason, ReportStatus } from "@alkok/core";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Textarea,
  toast,
  type DataTableColumn,
} from "@alkok/ui";
import type { AdminReportItem } from "../api/admin-reports.api";
import {
  adminReportFormSchema,
  type AdminReportFormValues,
} from "../model/admin-report-form.schema";
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

  const reportsQuery = useAdminReportsQuery(statusFilter || undefined);
  const updateMutation = useUpdateAdminReportMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminReportFormValues>({
    resolver: zodResolver(adminReportFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      status: "RESOLVED",
      resolutionMemo: "",
    },
  });

  const openModal = (item: AdminReportItem) => {
    setSelected(item);
    reset({
      status: item.status === "OPEN" ? "RESOLVED" : item.status,
      resolutionMemo: item.resolutionMemo ?? "",
    });
  };

  const handleValidSubmit = async (values: AdminReportFormValues) => {
    if (!selected) return;
    try {
      await updateMutation.mutateAsync({
        id: selected.id,
        status: values.status,
        resolutionMemo: values.resolutionMemo.trim() || undefined,
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
        <div className="flex flex-col gap-1">
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
        <div className="flex flex-wrap items-center gap-2">
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

      <div className="min-h-[180px]">
        {reportsQuery.isLoading ? (
          <div
            role="status"
            aria-label="오류 제보 불러오는 중"
            className="space-y-2 rounded-lg border border-border bg-card p-3"
          >
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <span className="sr-only">오류 제보 목록을 불러오고 있습니다.</span>
          </div>
        ) : reportsQuery.isError ? (
          <ErrorState
            title="오류 제보 목록을 불러오지 못했습니다."
            description="잠시 후 다시 시도해 주세요."
          />
        ) : rows.length === 0 ? (
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
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>제보 상태 처리</DialogTitle>
          </DialogHeader>
          <form
            noValidate
            onSubmit={handleSubmit(handleValidSubmit)}
            className="flex flex-col gap-3"
          >
            <FieldGroup htmlFor="admin-report-status" label="처리 상태">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="admin-report-status"
                      className="h-9 bg-background text-sm"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">접수됨</SelectItem>
                      <SelectItem value="IN_PROGRESS">확인 중</SelectItem>
                      <SelectItem value="RESOLVED">해결됨</SelectItem>
                      <SelectItem value="DISMISSED">반려됨</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldGroup>

            <FieldGroup
              htmlFor="admin-report-memo"
              label="처리 메모"
              error={errors.resolutionMemo?.message}
              errorId="admin-report-memo-error"
            >
              <Textarea
                id="admin-report-memo"
                rows={3}
                placeholder="조치 내역 또는 반려 사유"
                aria-invalid={Boolean(errors.resolutionMemo)}
                aria-describedby={
                  errors.resolutionMemo ? "admin-report-memo-error" : undefined
                }
                {...register("resolutionMemo")}
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
