"use client";

import { Pencil, Play, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { JobStatus } from "@alkok/core";
import {
  Badge,
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  ErrorState,
  Skeleton,
  Switch,
  type DataTableColumn,
} from "@alkok/ui";
import type { JobRunItem, SourceItem } from "../api/admin-sources.api";
import {
  useAdminJobsList,
  useAdminSourcesList,
  useCreateAdminSource,
  useDeleteAdminSource,
  useTriggerSourceFetch,
  useUpdateAdminSource,
} from "../model/useAdminSources";
import { SourceFormDialog } from "./SourceFormDialog";

const JOB_STATUS_BADGE: Record<
  JobStatus,
  { label: string; variant: "valid" | "review" | "expired" | "secondary" }
> = {
  PENDING: { label: "대기", variant: "secondary" },
  RUNNING: { label: "실행 중", variant: "review" },
  SUCCEEDED: { label: "성공", variant: "valid" },
  FAILED: { label: "실패", variant: "expired" },
  DEAD_LETTER: { label: "영구 실패", variant: "expired" },
};

export const AdminSourcesManager = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SourceItem | null>(null);
  const [deleting, setDeleting] = useState<SourceItem | null>(null);

  const { data, isLoading, isError, refetch } = useAdminSourcesList();
  const jobsQuery = useAdminJobsList();

  const createMutation = useCreateAdminSource();
  const updateMutation = useUpdateAdminSource();
  const deleteMutation = useDeleteAdminSource();
  const fetchMutation = useTriggerSourceFetch();

  const sources = data?.data ?? [];
  const jobs = jobsQuery.data?.data ?? [];

  const sourceColumns: DataTableColumn<SourceItem>[] = [
    {
      key: "name",
      header: "출처명",
      cell: (row) => (
        <div className="max-w-xs">
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.feedUrl}</p>
        </div>
      ),
    },
    {
      key: "sourceType",
      header: "유형",
      cell: (row) => <Badge variant="official">{row.sourceType}</Badge>,
    },
    {
      key: "interval",
      header: "주기",
      cell: (row) => (
        <span className="tabular-nums text-xs">{row.fetchIntervalHours}시간</span>
      ),
    },
    {
      key: "active",
      header: "활성",
      cell: (row) => (
        <Switch
          checked={row.isActive}
          aria-label={`${row.name} 활성 토글`}
          onCheckedChange={(checked) =>
            updateMutation.mutate({ id: row.id, payload: { isActive: checked } })
          }
        />
      ),
    },
    {
      key: "status",
      header: "최근 수집 / 오류",
      cell: (row) => (
        <div className="max-w-xs text-xs">
          <p className="tabular-nums text-muted-foreground">
            {row.lastFetchedAt ? row.lastFetchedAt.slice(0, 16).replace("T", " ") : "미수집"}
          </p>
          {row.lastError ? (
            <p className="truncate text-status-expired-fg">{row.lastError}</p>
          ) : null}
        </div>
      ),
    },
    {
      key: "actions",
      header: "작업",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchMutation.mutate(row.id)}
            disabled={fetchMutation.isPending}
          >
            <Play className="h-3.5 w-3.5" strokeWidth={1.75} />
            지금 수집
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`${row.name} 수정`}
            onClick={() => {
              setEditing(row);
              setFormOpen(true);
            }}
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`${row.name} 삭제`}
            onClick={() => setDeleting(row)}
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" strokeWidth={1.75} />
          </Button>
        </div>
      ),
    },
  ];

  const jobColumns: DataTableColumn<JobRunItem>[] = [
    { key: "type", header: "Job 유형", cell: (j) => <Badge variant="secondary">{j.type}</Badge> },
    {
      key: "status",
      header: "상태",
      cell: (j) => {
        const meta = JOB_STATUS_BADGE[j.status];
        return <Badge variant={meta.variant}>{meta.label}</Badge>;
      },
    },
    {
      key: "attempts",
      header: "시도",
      cell: (j) => (
        <span className="tabular-nums text-xs">
          {j.attempts}/{j.maxAttempts}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "생성 시각",
      cell: (j) => (
        <span className="tabular-nums text-xs text-muted-foreground">
          {j.createdAt.slice(0, 16).replace("T", " ")}
        </span>
      ),
    },
    {
      key: "error",
      header: "메시지",
      cell: (j) => (
        <span className="text-xs text-muted-foreground">
          {j.errorMessage ?? "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight">수집 출처 관리</h1>
          <p className="text-sm text-muted-foreground">
            공식 RSS/API 출처 등록, 주기 설정, 즉시 수집 트리거 및 JobRun 이력을 확인합니다.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          새 출처 등록
        </Button>
      </div>

      <div className="min-h-[180px]">
        {isLoading ? (
          <div
            role="status"
            aria-label="수집 출처 불러오는 중"
            className="space-y-2 rounded-lg border border-border bg-card p-3"
          >
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <span className="sr-only">수집 출처 목록을 불러오고 있습니다.</span>
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <DataTable
            compact
            columns={sourceColumns}
            rows={sources}
            getRowKey={(r) => r.id}
            emptyState={<EmptyState title="등록된 수집 출처가 없습니다." />}
          />
        )}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">최근 수집 작업(JobRun) 상태</h2>
        <div className="min-h-[160px]">
          {jobsQuery.isLoading ? (
            <div
              role="status"
              aria-label="수집 작업 이력 불러오는 중"
              className="space-y-2 rounded-lg border border-border bg-card p-3"
            >
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-10 w-full" />
              <span className="sr-only">수집 작업 이력을 불러오고 있습니다.</span>
            </div>
          ) : jobsQuery.isError ? (
            <ErrorState onRetry={() => jobsQuery.refetch()} />
          ) : (
            <DataTable
              compact
              columns={jobColumns}
              rows={jobs}
              getRowKey={(j) => j.id}
              emptyState={<EmptyState title="최근 실행된 작업이 없습니다." />}
            />
          )}
        </div>
      </section>

      <SourceFormDialog
        key={editing?.id ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editing}
        isPending={createMutation.isPending || updateMutation.isPending}
        onSubmit={async (payload) => {
          if (editing) {
            await updateMutation.mutateAsync({ id: editing.id, payload });
          } else {
            await createMutation.mutateAsync(payload);
          }
        }}
      />

      <Dialog open={Boolean(deleting)} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>출처 삭제 확인</DialogTitle>
            <DialogDescription>
              {deleting?.name} 출처를 삭제(Soft Delete)하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleting(null)}>
              취소
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteMutation.isPending}
              onClick={async () => {
                if (deleting) {
                  await deleteMutation.mutateAsync(deleting.id);
                  setDeleting(null);
                }
              }}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
