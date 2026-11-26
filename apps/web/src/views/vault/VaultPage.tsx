"use client";

import { useQueryClient } from "@tanstack/react-query";
import { BookmarkCheck, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  syncLocalVaultToServer,
  useDeleteVaultTagMutation,
  useLocalVaultStore,
  useVaultFoldersQuery,
  useVaultItemsQuery,
  useVaultTagsQuery,
  type LocalVaultItem,
} from "@/entities/vault";
import { VaultFolderSidebar, VaultItemCard } from "@/features/vault-manage";
import { ExternalUrlModal } from "@/features/vault-save";
import {
  selectIsAuthenticated,
  useAuthStore,
  type ContentType,
  type VaultItemType,
} from "@alkok/core";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  FilterBar,
  Input,
  Skeleton,
} from "@alkok/ui";

const TYPE_LABELS: Record<ContentType, string> = {
  GUIDE: "업무 가이드",
  TOOL: "도구·모델",
  NEWS: "AI 소식",
};

function getLocalItemHref(item: LocalVaultItem): string {
  if (!item.slug) return "/guides";
  if (item.contentType === "TOOL") return `/tools/${item.slug}`;
  if (item.contentType === "NEWS") return `/news/${item.slug}`;
  return `/guides/${item.slug}`;
}

export default function VaultPage() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  const localItems = useLocalVaultStore((s) => s.items);
  const removeLocalItem = useLocalVaultStore((s) => s.removeItem);

  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [itemType, setItemType] = useState<VaultItemType | "">("");
  const [guestContentType, setGuestContentType] = useState<ContentType | "">("");
  const [searchText, setSearchText] = useState("");
  const syncedOnAuthRef = useRef(false);

  useEffect(() => {
    void useLocalVaultStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      syncedOnAuthRef.current = false;
      return;
    }
    if (syncedOnAuthRef.current || localItems.length === 0) return;
    syncedOnAuthRef.current = true;
    void syncLocalVaultToServer(queryClient).then((result) => {
      if (result.syncedCount > 0) {
        toast.success(
          `로컬 보관함 ${result.syncedCount}건을 서버 보관함에 동기화했습니다.`,
        );
      }
    });
  }, [isAuthenticated, localItems.length, queryClient]);

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

  const filteredLocalItems = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return localItems.filter((item) => {
      if (guestContentType && item.contentType !== guestContentType) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        (item.summary?.toLowerCase().includes(q) ?? false) ||
        (item.memo?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [localItems, guestContentType, searchText]);

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="보관함 불러오는 중"
        className="flex w-full flex-col gap-6"
      >
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">내 보관함</h1>
            <p className="text-sm text-muted-foreground">
              저장한 가이드·도구·소식과 외부 AI 링크를 한곳에서 관리합니다.
            </p>
          </div>
          <Skeleton className="h-9 w-32 rounded-md" />
        </header>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
                >
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <span className="sr-only">보관함을 불러오고 있습니다.</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">내 보관함 (로컬 저장)</h1>
            <p className="text-sm text-muted-foreground">
              브라우저에 저장된 AI 가이드·도구·소식을 바로 찾아볼 수 있습니다.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="min-h-11 sm:min-h-9">
            <Link href="/login?next=/vault">+ 외부 URL 저장 (로그인)</Link>
          </Button>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface-sunken p-4">
          <p className="text-sm text-foreground">
            로그인하면 기기 간 동기화와 외부 URL 저장을 사용할 수 있어요
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="min-h-11 sm:min-h-8">
              <Link href="/signup">회원가입</Link>
            </Button>
            <Button size="sm" asChild className="min-h-11 sm:min-h-8">
              <Link href="/login?next=/vault">로그인하고 동기화하기</Link>
            </Button>
          </div>
        </div>

        <FilterBar>
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="저장한 항목 제목 또는 요약 검색"
            aria-label="로컬 보관함 검색"
            wrapperClassName="min-w-48 flex-1"
            startIcon={<Search className="h-4 w-4" />}
          />

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { value: "", label: "전체" },
                { value: "GUIDE", label: "업무 가이드" },
                { value: "TOOL", label: "도구·모델" },
                { value: "NEWS", label: "AI 소식" },
              ] as const
            ).map((opt) => (
              <Button
                key={opt.label}
                type="button"
                size="sm"
                variant={guestContentType === opt.value ? "default" : "outline"}
                onClick={() => setGuestContentType(opt.value)}
                className="min-h-11 sm:min-h-8"
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </FilterBar>

        {filteredLocalItems.length === 0 ? (
          <EmptyState
            icon={<BookmarkCheck className="h-6 w-6" aria-hidden="true" />}
            title="아직 로컬 보관함에 저장된 항목이 없습니다."
            description="가이드·도구·소식에서 '보관함에 콕 담기'를 누르면 로그인 없이 바로 저장됩니다."
            action={
              <Button variant="outline" size="sm" asChild>
                <Link href="/guides">가이드 둘러보기</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLocalItems.map((item) => (
              <Card
                key={item.contentId}
                className="flex flex-col justify-between transition-colors duration-150 ease-out hover:bg-surface-sunken"
              >
                <CardHeader className="gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">
                      {item.contentType ? TYPE_LABELS[item.contentType] : "알콕 자료"}
                    </Badge>
                    <span className="tabular-nums text-xs text-muted-foreground">
                      {item.savedAt.slice(0, 10)}
                    </span>
                  </div>
                  <CardTitle className="text-base leading-snug">
                    <Link
                      href={getLocalItemHref(item)}
                      className="hover:text-primary hover:underline"
                    >
                      {item.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {item.summary ? (
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {item.summary}
                    </p>
                  ) : null}
                  <div className="flex items-center justify-end border-t border-separator pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`${item.title} 삭제`}
                      onClick={() => {
                        removeLocalItem(item.contentId);
                        toast.success("브라우저 보관함에서 제거했습니다.");
                      }}
                      className="min-h-11 text-destructive hover:text-destructive sm:min-h-8"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      삭제
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-7 w-7 rounded-md" />
                  </div>
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
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
