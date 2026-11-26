"use client";

import { AlertTriangle, Link2 } from "lucide-react";
import { useState } from "react";
import {
  ManualUrlIngestDialog,
  useAdminInboxDetail,
  useAdminInboxList,
  useApproveInboxItem,
  useManualUrlIngest,
  useRejectInboxItem,
  useSaveInboxDraft,
} from "@/features/admin-inbox";
import {
  Badge,
  Button,
  DataTable,
  EmptyState,
  ErrorState,
  Skeleton,
  type DataTableColumn,
} from "@alkok/ui";
import { AdminReviewSplitView } from "@/widgets/admin-review";
import type { InboxQueueItem } from "@/features/admin-inbox";

export default function AdminInboxPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ingestOpen, setIngestOpen] = useState(false);

  const listQuery = useAdminInboxList();
  const detailQuery = useAdminInboxDetail(selectedId);
  const manualUrlMutation = useManualUrlIngest();
  const approveMutation = useApproveInboxItem();
  const saveDraftMutation = useSaveInboxDraft();
  const rejectMutation = useRejectInboxItem();

  const items = listQuery.data?.data ?? [];

  const columns: DataTableColumn<InboxQueueItem>[] = [
    {
      key: "type",
      header: "유형",
      cell: (row) => <Badge variant="secondary">{row.type}</Badge>,
    },
    {
      key: "title",
      header: "초안 제목",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{row.title}</span>
          {row.unverifiedFields.length > 0 ? (
            <Badge variant="review">
              <AlertTriangle className="h-3 w-3" strokeWidth={1.75} />
              확인 필요 {row.unverifiedFields.length}
            </Badge>
          ) : null}
        </div>
      ),
    },
    {
      key: "status",
      header: "상태",
      cell: (row) => <Badge variant="outline">{row.publishStatus}</Badge>,
    },
    {
      key: "action",
      header: "검수",
      cell: (row) => (
        <Button
          size="sm"
          variant={selectedId === row.id ? "default" : "outline"}
          onClick={() => setSelectedId(row.id)}
        >
          {selectedId === row.id ? "검수 중" : "검수하기"}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight">수집함 & AI 초안 검수</h1>
          <p className="text-sm text-muted-foreground">
            수집 대기열(DRAFT/IN_REVIEW)과 원문 근거를 대조해 원클릭 승인·공개합니다.
          </p>
        </div>
        <Button size="sm" onClick={() => setIngestOpen(true)}>
          <Link2 className="h-4 w-4" strokeWidth={1.75} />
          URL 수동 투입
        </Button>
      </div>

      <div className="min-h-[180px]">
        {listQuery.isLoading ? (
          <div
            role="status"
            aria-label="수집 대기열 불러오는 중"
            className="space-y-2 rounded-lg border border-border bg-card p-3"
          >
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <span className="sr-only">수집 대기열을 불러오고 있습니다.</span>
          </div>
        ) : listQuery.isError ? (
          <ErrorState onRetry={() => listQuery.refetch()} />
        ) : (
          <DataTable
            compact
            columns={columns}
            rows={items}
            getRowKey={(r) => r.id}
            emptyState={
              <EmptyState
                title="검수 대기 중인 초안이 없습니다."
                description="URL 수동 투입으로 새 문서를 수집하거나 RSS 스케줄 수집을 기다려 주세요."
              />
            }
          />
        )}
      </div>

      <AdminReviewSplitView
        item={detailQuery.data?.data ?? null}
        isLoading={Boolean(selectedId) && detailQuery.isLoading}
        error={
          detailQuery.isError ? "상세 초안을 불러오지 못했습니다." : null
        }
        onRetry={() => detailQuery.refetch()}
        isSubmitting={
          approveMutation.isPending ||
          saveDraftMutation.isPending ||
          rejectMutation.isPending
        }
        onApprove={async (payload) => {
          if (!selectedId) return;
          await approveMutation.mutateAsync({ id: selectedId, payload });
          setSelectedId(null);
        }}
        onSaveDraft={async (payload) => {
          if (!selectedId) return;
          await saveDraftMutation.mutateAsync({ id: selectedId, payload });
        }}
        onReject={async () => {
          if (!selectedId) return;
          await rejectMutation.mutateAsync({ id: selectedId });
          setSelectedId(null);
        }}
      />

      <ManualUrlIngestDialog
        open={ingestOpen}
        onOpenChange={setIngestOpen}
        isPending={manualUrlMutation.isPending}
        onSubmit={async (url) => {
          await manualUrlMutation.mutateAsync(url);
        }}
      />
    </div>
  );
}
