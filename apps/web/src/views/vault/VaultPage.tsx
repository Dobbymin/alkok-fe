"use client";

import { BookmarkCheck, Search } from "lucide-react";
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
import { useAuth } from "@alkok/core";
import type { VaultItemType } from "@alkok/core";
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  FilterBar,
  Input,
} from "@alkok/ui";

export default function VaultPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

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
      <div className="mx-auto max-w-5xl py-6">
        <div className="h-72 rounded-lg bg-muted/40" />
      </div>
    );
  }

  const folders = foldersQuery.data?.data ?? [];
  const tags = tagsQuery.data?.data ?? [];
  const items = itemsQuery.data?.data ?? [];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">내 보관함</h1>
          <p className="text-sm text-muted-foreground">
            저장한 알콕 콘텐츠와 외부 AI 참고 링크를 폴더·태그로 관리합니다.
          </p>
        </div>
        <ExternalUrlModal folders={folders} defaultFolderId={selectedFolderId} />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <VaultFolderSidebar
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelectFolder={setSelectedFolderId}
          />

          {tags.length > 0 ? (
            <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                태그
              </h2>
              <div className="flex flex-wrap gap-1.5">
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
                      className="ml-0.5 text-[10px] opacity-70 hover:opacity-100"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <section className="flex flex-col gap-4">
          <FilterBar>
            <div className="relative flex-1 min-w-48">
              <Search
                className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="제목 또는 메모 검색"
                aria-label="보관함 검색"
                className="pl-8"
              />
            </div>

            <div className="flex items-center gap-1.5">
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
            />
          ) : itemsQuery.isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-36 rounded-lg bg-muted/40" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={<BookmarkCheck className="h-6 w-6" aria-hidden="true" />}
              title="저장된 항목이 없습니다."
              description="가이드·도구·소식에서 보관함 저장을 누르거나 외부 URL을 추가해 보세요."
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
