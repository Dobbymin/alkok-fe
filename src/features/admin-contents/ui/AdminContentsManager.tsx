"use client";

import { Archive, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type {
  ContentSummary,
  ContentType,
  PublishStatus,
  VerificationStatus,
} from "@/shared/types";
import {
  Badge,
  Button,
  DataTable,
  EmptyState,
  ErrorState,
  FilterBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  type DataTableColumn,
} from "@/shared/ui";
import {
  useAdminContentsList,
  useArchiveAdminContent,
  useCreateAdminContent,
  useDeleteAdminContent,
  useVerifyAdminContent,
} from "../model/useAdminContents";
import { AdminContentFormDialog } from "./AdminContentFormDialog";

const VERIFICATION_LABEL: Record<
  VerificationStatus,
  { label: string; variant: "valid" | "review" | "expired" }
> = {
  VALID: { label: "유효", variant: "valid" },
  NEEDS_REVIEW: { label: "확인 필요", variant: "review" },
  EXPIRED: { label: "만료", variant: "expired" },
};

export const AdminContentsManager = () => {
  const [typeFilter, setTypeFilter] = useState<ContentType | "ALL">("ALL");
  const [publishFilter, setPublishFilter] = useState<PublishStatus | "ALL">("ALL");
  const [verificationFilter, setVerificationFilter] = useState<
    VerificationStatus | "ALL"
  >("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useAdminContentsList({
    type: typeFilter === "ALL" ? "" : typeFilter,
    publishStatus: publishFilter === "ALL" ? "" : publishFilter,
    verificationStatus: verificationFilter === "ALL" ? "" : verificationFilter,
  });

  const createMutation = useCreateAdminContent();
  const verifyMutation = useVerifyAdminContent();
  const archiveMutation = useArchiveAdminContent();
  const deleteMutation = useDeleteAdminContent();

  const rows = data?.data ?? [];

  const columns: DataTableColumn<ContentSummary>[] = [
    {
      key: "type",
      header: "유형",
      cell: (row) => <Badge variant="secondary">{row.type}</Badge>,
    },
    {
      key: "title",
      header: "제목",
      cell: (row) => (
        <div className="max-w-sm">
          <p className="truncate font-medium text-foreground">{row.title}</p>
          <p className="truncate text-xs text-muted-foreground">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "publishStatus",
      header: "발행",
      cell: (row) => <Badge variant="outline">{row.publishStatus}</Badge>,
    },
    {
      key: "verificationStatus",
      header: "유효성",
      cell: (row) => {
        const meta = VERIFICATION_LABEL[row.verificationStatus];
        return <Badge variant={meta.variant}>{meta.label}</Badge>;
      },
    },
    {
      key: "verifiedAt",
      header: "확인일",
      cell: (row) => (
        <span className="tabular-nums text-xs text-muted-foreground">
          {row.verifiedAt ? row.verifiedAt.slice(0, 10) : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "작업",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => verifyMutation.mutate(row.id)}
            disabled={verifyMutation.isPending}
          >
            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            확인 완료
          </Button>
          {row.publishStatus !== "ARCHIVED" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => archiveMutation.mutate(row.id)}
              disabled={archiveMutation.isPending}
              aria-label={`${row.title} 보관`}
            >
              <Archive className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteMutation.mutate(row.id)}
            disabled={deleteMutation.isPending}
            aria-label={`${row.title} 삭제`}
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" strokeWidth={1.75} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight">콘텐츠 통합 관리</h1>
          <p className="text-sm text-muted-foreground">
            가이드·도구·소식 수동 등록, 확인 완료(verifiedAt 갱신), 보관 상태를 관리합니다.
          </p>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          새 콘텐츠 작성
        </Button>
      </div>

      <FilterBar>
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as ContentType | "ALL")}
        >
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue placeholder="유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체 유형</SelectItem>
            <SelectItem value="GUIDE">GUIDE</SelectItem>
            <SelectItem value="TOOL">TOOL</SelectItem>
            <SelectItem value="NEWS">NEWS</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={publishFilter}
          onValueChange={(v) => setPublishFilter(v as PublishStatus | "ALL")}
        >
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue placeholder="발행 상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체 발행 상태</SelectItem>
            <SelectItem value="DRAFT">DRAFT</SelectItem>
            <SelectItem value="IN_REVIEW">IN_REVIEW</SelectItem>
            <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
            <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={verificationFilter}
          onValueChange={(v) =>
            setVerificationFilter(v as VerificationStatus | "ALL")
          }
        >
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue placeholder="유효성" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">전체 유효성</SelectItem>
            <SelectItem value="VALID">유효</SelectItem>
            <SelectItem value="NEEDS_REVIEW">확인 필요</SelectItem>
            <SelectItem value="EXPIRED">만료</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <DataTable
          compact
          columns={columns}
          rows={rows}
          getRowKey={(r) => r.id}
          emptyState={
            <EmptyState
              title="등록된 콘텐츠가 없습니다."
              description="새 콘텐츠 작성 버튼으로 가이드·도구·소식을 추가해 보세요."
            />
          }
        />
      )}

      <AdminContentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isPending={createMutation.isPending}
        onSubmit={async (payload) => {
          await createMutation.mutateAsync(payload);
        }}
      />
    </div>
  );
};
