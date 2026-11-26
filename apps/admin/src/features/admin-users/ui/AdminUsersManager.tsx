"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import type { UserProfile, UserRole, UserStatus } from "@alkok/core";
import {
  Badge,
  DataTable,
  EmptyState,
  ErrorState,
  FilterBar,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  type DataTableColumn,
} from "@alkok/ui";
import {
  useAdminUsersList,
  useUpdateAdminUserRole,
  useUpdateAdminUserStatus,
} from "../model/useAdminUsers";

export const AdminUsersManager = () => {
  const [searchText, setSearchText] = useState("");
  const { data, isLoading, isError, refetch } = useAdminUsersList({
    q: searchText.trim(),
  });

  const roleMutation = useUpdateAdminUserRole();
  const statusMutation = useUpdateAdminUserStatus();
  const rows = data?.data ?? [];

  const columns: DataTableColumn<UserProfile>[] = [
    {
      key: "user",
      header: "회원",
      cell: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.nickname}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: "verified",
      header: "이메일 인증",
      cell: (row) =>
        row.emailVerifiedAt ? (
          <Badge variant="valid">인증 완료</Badge>
        ) : (
          <Badge variant="review">미인증</Badge>
        ),
    },
    {
      key: "role",
      header: "역할",
      cell: (row) => (
        <Select
          value={row.role}
          onValueChange={(v) =>
            roleMutation.mutate({ id: row.id, role: v as UserRole })
          }
          disabled={roleMutation.isPending}
        >
          <SelectTrigger
            aria-label={`${row.nickname} 역할`}
            className="h-8 w-28 text-xs"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">USER</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "status",
      header: "계정 상태",
      cell: (row) => (
        <Select
          value={row.status === "SUSPENDED" ? "SUSPENDED" : "ACTIVE"}
          onValueChange={(v) =>
            statusMutation.mutate({
              id: row.id,
              status: v as Extract<UserStatus, "ACTIVE" | "SUSPENDED">,
            })
          }
          disabled={statusMutation.isPending}
        >
          <SelectTrigger
            aria-label={`${row.nickname} 계정 상태`}
            className="h-8 w-32 text-xs"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
            <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">회원·권한 관리</h1>
        <p className="text-sm text-muted-foreground">
          이메일 인증 여부 확인 및 역할(USER/ADMIN)·계정 활성/정지 상태를 관리합니다.
        </p>
      </div>

      <FilterBar>
        <Input
          inputSize="sm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="이메일 또는 닉네임 검색"
          aria-label="회원 검색"
          wrapperClassName="w-full sm:w-72"
          startIcon={<Search className="h-4 w-4" strokeWidth={1.75} />}
        />
      </FilterBar>

      <div className="min-h-[160px]">
        {isLoading ? (
          <div
            role="status"
            aria-label="회원 목록 불러오는 중"
            className="space-y-2 rounded-lg border border-border bg-card p-3"
          >
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <span className="sr-only">회원 목록을 불러오고 있습니다.</span>
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <DataTable
            compact
            columns={columns}
            rows={rows}
            getRowKey={(r) => r.id}
            emptyState={<EmptyState title="일치하는 회원이 없습니다." />}
          />
        )}
      </div>
    </div>
  );
};
