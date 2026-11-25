"use client";

import { Bookmark, Check, Folder, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  useCreateBookmarkMutation,
  useDeleteVaultItemMutation,
  useUpdateVaultItemMutation,
  useVaultFoldersQuery,
  type VaultItem,
} from "@/entities/vault";
import { useAuth } from "@alkok/core";
import { cn } from "@alkok/core";
import {
  Button,
  FieldGroup,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Textarea,
} from "@alkok/ui";

export interface BookmarkActionProps {
  contentId: string;
  title?: string;
  initialSavedItem?: VaultItem | null;
  size?: "sm" | "default";
  className?: string;
}

const isMobileViewport = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(max-width: 767px)").matches;

export const BookmarkAction = ({
  contentId,
  title,
  initialSavedItem = null,
  size = "sm",
  className,
}: BookmarkActionProps) => {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { isAuthenticated } = useAuth();

  const [savedItem, setSavedItem] = useState<VaultItem | null>(initialSavedItem);
  const [editorOpen, setEditorOpen] = useState(false);
  const [useSheet, setUseSheet] = useState(false);
  const [folderId, setFolderId] = useState<string>(
    initialSavedItem?.folderId ?? "",
  );
  const [memo, setMemo] = useState<string>(initialSavedItem?.memo ?? "");
  const [tagsText, setTagsText] = useState<string>(
    initialSavedItem?.tags.map((t) => t.name).join(", ") ?? "",
  );

  const foldersQuery = useVaultFoldersQuery(isAuthenticated && editorOpen);
  const createBookmark = useCreateBookmarkMutation();
  const updateItem = useUpdateVaultItemMutation();
  const deleteItem = useDeleteVaultItemMutation();

  const folders = foldersQuery.data?.data ?? [];

  const handleToggle = async () => {
    if (!isAuthenticated) {
      toast.info("로그인 후 내 보관함에 저장할 수 있습니다.", {
        action: {
          label: "로그인",
          onClick: () =>
            router.push(`/login?next=${encodeURIComponent(pathname)}`),
        },
      });
      return;
    }

    setUseSheet(isMobileViewport());

    if (savedItem) {
      setEditorOpen((prev) => !prev);
      return;
    }

    try {
      const res = await createBookmark.mutateAsync({ contentId });
      const created = res.data;
      setSavedItem(created);
      setFolderId(created.folderId ?? "");
      setMemo(created.memo ?? "");
      setTagsText(created.tags.map((t) => t.name).join(", "));
      setEditorOpen(true);
      toast.success("내 보관함에 저장되었습니다.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "보관함 저장에 실패했습니다.",
      );
    }
  };

  const handleSaveMeta = async (e: FormEvent) => {
    e.preventDefault();
    if (!savedItem) return;
    const tagNames = tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      const res = await updateItem.mutateAsync({
        id: savedItem.id,
        input: {
          folderId: folderId || null,
          memo: memo.trim() || null,
          tagNames,
        },
      });
      setSavedItem(res.data);
      setEditorOpen(false);
      toast.success("보관함 정보가 업데이트되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "저장에 실패했습니다.");
    }
  };

  const handleRemove = async () => {
    if (!savedItem) return;
    try {
      await deleteItem.mutateAsync(savedItem.id);
      setSavedItem(null);
      setFolderId("");
      setMemo("");
      setTagsText("");
      setEditorOpen(false);
      toast.success("보관함에서 제거되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    }
  };

  const formBody = (
    <form onSubmit={handleSaveMeta} className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-foreground">
          보관함 빠른 정리
        </span>
        {title ? (
          <span className="truncate text-[11px] text-muted-foreground max-w-44">
            {title}
          </span>
        ) : null}
      </div>

      <FieldGroup htmlFor={`bm-folder-${contentId}`} label="폴더">
        <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring">
          <Folder
            className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <select
            id={`bm-folder-${contentId}`}
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            className="h-full w-full bg-transparent text-xs text-foreground focus:outline-none"
          >
            <option value="">미분류</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </FieldGroup>

      <FieldGroup htmlFor={`bm-tags-${contentId}`} label="태그 (쉼표 구분)">
        <Input
          id={`bm-tags-${contentId}`}
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          placeholder="예: 보고서, 주간업무"
        />
      </FieldGroup>

      <FieldGroup htmlFor={`bm-memo-${contentId}`} label="메모">
        <Textarea
          id={`bm-memo-${contentId}`}
          rows={2}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="활용 팁이나 참고 메모"
        />
      </FieldGroup>

      <div className="flex items-center justify-between gap-2 pt-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={deleteItem.isPending}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          저장 해제
        </Button>
        <Button type="submit" size="sm" disabled={updateItem.isPending}>
          {updateItem.isPending ? "저장 중..." : "적용"}
        </Button>
      </div>
    </form>
  );

  const triggerButton = (
    <Button
      type="button"
      variant={savedItem ? "secondary" : "outline"}
      size={size}
      onClick={handleToggle}
      disabled={createBookmark.isPending}
      aria-pressed={Boolean(savedItem)}
      aria-label={savedItem ? "보관함 저장됨 (편집)" : "보관함에 저장"}
      className={cn("gap-2", className)}
    >
      {savedItem ? (
        <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
      ) : (
        <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      <span>{savedItem ? "저장됨" : "보관함 저장"}</span>
    </Button>
  );

  if (useSheet) {
    return (
      <>
        {triggerButton}
        <Sheet open={editorOpen} onOpenChange={setEditorOpen}>
          <SheetContent side="bottom" className="rounded-t-xl">
            <SheetHeader>
              <SheetTitle>보관함 빠른 정리</SheetTitle>
              <SheetDescription>
                저장된 항목의 폴더, 태그, 메모를 설정합니다.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4">{formBody}</div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <Popover open={editorOpen} onOpenChange={setEditorOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        {formBody}
      </PopoverContent>
    </Popover>
  );
};
