"use client";

import { BookmarkCheck, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useDeleteVaultTagMutation,
  useVaultFoldersQuery,
  useVaultItemsQuery,
  useVaultTagsQuery,
} from "@/entities/vault";
import { VaultFolderSidebar, VaultItemCard } from "@/features/vault-manage";
import { ExternalUrlModal } from "@/features/vault-save";
import { selectIsAuthenticated, useAuthStore } from "@alkok/core";
import type { VaultItemType } from "@alkok/core";
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  FilterBar,
  Input,
  Skeleton,
} from "@alkok/ui";

export default function VaultPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [itemType, setItemType] = useState<VaultItemType | "">("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?next=/vault");
    }
  }, [isAuthenticated, isLoading, router]);

  const foldersQuery = useVaultFoldersQuery(isAuthenticated);
  const tagsQuery = useVaultTagsQuery(isAuthenticated);
  const itemsQuery = useVaultItemsQuery(
    {
      folderId: selectedFolderId || undefined,
      tag: selectedTag || undefined,
      itemType: itemType || undefined,
      q: searchText.trim() || undefined,
    },
    isAuthenticated,
  );
  const deleteTagMutation = useDeleteVaultTagMutation();

  if (isLoading || !isAuthenticated) {
    return (
      <div role="status" aria-label="보관함 불러오는 중" className="w-full py-6">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <span className="sr-only">보관함을 불러오고 있습니다.</span>
      </div>
    );
  }

  const folders = foldersQuery.data?.data ?? [];
  const tags = tagsQuery.data?.data ?? [];
  const items = itemsQuery.data?.data ?? [];

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">내 보관함</h1>
          <p className="text-sm text-muted-foreground">
            저장한 알콕 콘텐츠와 외부 AI 참고 링크를 폴더·태그로 관리합니다.
          </p>
        </div>
        <ExternalUrlModal folders={folders} defaultFolderId={selectedFolderId} />
      </header>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="flex w-full shrink-0 flex-col gap-4 md:w-60">
          <VaultFolderSidebar
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelectFolder={setSelectedFolderId}
          />

          {tags.length > 0 ? (
            <div className="flex flex-col gap-2 rounded-xl border border-transparent bg-surface-sunken p-3 dark:border-border">
              <h2 className="text-xs font-semibold text-muted-foreground">
                태그
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTag === tag.name ? "default" : "outline"}
                    className="cursor-pointer gap-1"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedTag((prev) =>
                          prev === tag.name ? "" : tag.name,
                        )
                      }
                    >
                      #{tag.name}
                    </button>
                    <button
                      type="button"
                      aria-label={`${tag.name} 태그 삭제`}
                      onClick={() => {
                        void deleteTagMutation.mutateAsync(tag.id);
                        if (selectedTag === tag.name) setSelectedTag("");
                      }}
                      className="ms-1 text-[10px] opacity-70 hover:opacity-100"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <section className="flex min-w-0 flex-1 flex-col gap-4">
          <FilterBar>
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="제목 또는 메모 검색"
              aria-label="보관함 검색"
              wrapperClassName="min-w-48 flex-1"
              startIcon={<Search className="h-4 w-4" />}
            />

            <div className="flex items-center gap-2">
              {(
                [
                  { value: "", label: "전체" },
                  { value: "INTERNAL_CONTENT", label: "알콕 콘텐츠" },
                  { value: "EXTERNAL_URL", label: "외부 URL" },
                ] as const
              ).map((opt) => (
                <Button
                  key={opt.label}
                  type="button"
                  size="sm"
                  variant={itemType === opt.value ? "default" : "outline"}
                  onClick={() => setItemType(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </FilterBar>

          {itemsQuery.isError ? (
            <ErrorState
              title="보관함을 불러오지 못했습니다."
              description="잠시 후 다시 시도해 주세요."
              onRetry={() => itemsQuery.refetch()}
            />
          ) : itemsQuery.isLoading ? (
            <div role="status" aria-label="저장된 항목 불러오는 중" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
              <span className="sr-only">저장된 항목을 불러오고 있습니다.</span>
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={<BookmarkCheck className="h-6 w-6" aria-hidden="true" />}
              title="저장된 항목이 없습니다."
              description="가이드·도구·소식에서 보관함 저장을 누르거나 외부 URL을 추가해 보세요."
              action={
                <Button variant="outline" size="sm" asChild>
                  <Link href="/guides">가이드 둘러보기</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {items.map((item) => (
                <VaultItemCard key={item.id} item={item} folders={folders} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
