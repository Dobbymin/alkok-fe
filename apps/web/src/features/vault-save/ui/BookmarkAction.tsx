"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bookmark, Check, Folder, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useCreateBookmarkMutation,
  useDeleteVaultItemMutation,
  useLocalVaultStore,
  useUpdateVaultItemMutation,
  useVaultFoldersQuery,
  type VaultItem,
} from "@/entities/vault";
import {
  cn,
  parseCommaSeparated,
  selectIsAuthenticated,
  useAuthStore,
  type ContentType,
} from "@alkok/core";
import {
  Button,
  FieldGroup,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Textarea,
  toast,
} from "@alkok/ui";
import {
  bookmarkMetaSchema,
  type BookmarkMetaFormValues,
} from "../model/vault-save.schema";

const UNCLASSIFIED_FOLDER_VALUE = "__UNCLASSIFIED__";

export interface BookmarkActionProps {
  contentId: string;
  title?: string;
  contentType?: ContentType;
  slug?: string;
  summary?: string;
  initialSavedItem?: VaultItem | null;
  size?: "sm" | "default";
  iconOnly?: boolean;
  className?: string;
}

const isMobileViewport = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(max-width: 767px)").matches;

export const BookmarkAction = ({
  contentId,
  title,
  contentType,
  slug,
  summary,
  initialSavedItem = null,
  size = "sm",
  iconOnly = false,
  className,
}: BookmarkActionProps) => {
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  const localSaved = useLocalVaultStore((s) =>
    s.items.some((i) => i.contentId === contentId),
  );
  const toggleLocalItem = useLocalVaultStore((s) => s.toggleItem);

  useEffect(() => {
    void useLocalVaultStore.persist.rehydrate();
  }, []);

  const [savedItem, setSavedItem] = useState<VaultItem | null>(initialSavedItem);
  const [editorOpen, setEditorOpen] = useState(false);
  const [useSheet, setUseSheet] = useState(false);

  const foldersQuery = useVaultFoldersQuery(isAuthenticated && editorOpen);
  const createBookmark = useCreateBookmarkMutation();
  const updateItem = useUpdateVaultItemMutation();
  const deleteItem = useDeleteVaultItemMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookmarkMetaFormValues>({
    resolver: zodResolver(bookmarkMetaSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      folderId: initialSavedItem?.folderId ?? "",
      memo: initialSavedItem?.memo ?? "",
      tagsText: initialSavedItem?.tags.map((t) => t.name).join(", ") ?? "",
    },
  });

  const folders = foldersQuery.data?.data ?? [];
  const isSaved = isAuthenticated ? Boolean(savedItem) : localSaved;

  const handleToggle = async () => {
    if (!isAuthenticated) {
      const added = toggleLocalItem({
        contentId,
        title: title ?? "저장한 자료",
        contentType,
        slug,
        summary,
      });
      if (added) {
        toast.success("브라우저 보관함에 콕 저장했습니다.", {
          action: {
            label: "보관함 보기",
            onClick: () => router.push("/vault"),
          },
        });
      } else {
        toast.success("브라우저 보관함에서 제거했습니다.");
      }
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
      reset({
        folderId: created.folderId ?? "",
        memo: created.memo ?? "",
        tagsText: created.tags.map((t) => t.name).join(", "),
      });
      setEditorOpen(true);
      toast.success("내 보관함에 저장되었습니다.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "보관함 저장에 실패했습니다.",
      );
    }
  };

  const handleSaveMeta = async (values: BookmarkMetaFormValues) => {
    if (!savedItem) return;
    const tagNames = parseCommaSeparated(values.tagsText);
    try {
      const res = await updateItem.mutateAsync({
        id: savedItem.id,
        input: {
          folderId: values.folderId || null,
          memo: values.memo.trim() || null,
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
      reset({ folderId: "", memo: "", tagsText: "" });
      setEditorOpen(false);
      toast.success("보관함에서 제거되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    }
  };

  const formBody = (
    <form
      noValidate
      onSubmit={handleSubmit(handleSaveMeta)}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-foreground">
          보관함 빠른 정리
        </span>
        {title ? (
          <span className="max-w-44 truncate text-[11px] text-muted-foreground">
            {title}
          </span>
        ) : null}
      </div>

      <FieldGroup htmlFor={`bm-folder-${contentId}`} label="폴더">
        <Controller
          name="folderId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || UNCLASSIFIED_FOLDER_VALUE}
              onValueChange={(v) =>
                field.onChange(v === UNCLASSIFIED_FOLDER_VALUE ? "" : v)
              }
            >
              <SelectTrigger
                id={`bm-folder-${contentId}`}
                className="h-9 bg-background text-xs"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Folder
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="truncate">
                    <SelectValue />
                  </span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UNCLASSIFIED_FOLDER_VALUE}>미분류</SelectItem>
                {folders.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FieldGroup>

      <FieldGroup
        htmlFor={`bm-tags-${contentId}`}
        label="태그 (쉼표 구분)"
        error={errors.tagsText?.message}
        errorId={`bm-tags-error-${contentId}`}
      >
        <Input
          id={`bm-tags-${contentId}`}
          placeholder="예: 보고서, 주간업무"
          aria-invalid={Boolean(errors.tagsText)}
          aria-describedby={
            errors.tagsText ? `bm-tags-error-${contentId}` : undefined
          }
          {...register("tagsText")}
        />
      </FieldGroup>

      <FieldGroup
        htmlFor={`bm-memo-${contentId}`}
        label="메모"
        error={errors.memo?.message}
        errorId={`bm-memo-error-${contentId}`}
      >
        <Textarea
          id={`bm-memo-${contentId}`}
          rows={2}
          placeholder="활용 팁이나 참고 메모"
          aria-invalid={Boolean(errors.memo)}
          aria-describedby={
            errors.memo ? `bm-memo-error-${contentId}` : undefined
          }
          {...register("memo")}
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

  const ariaLabel = isSaved
    ? isAuthenticated
      ? "보관함 저장됨 (편집)"
      : "보관함에 저장됨 (해제)"
    : "보관함에 콕 담기";

  const triggerButton = iconOnly ? (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={handleToggle}
      disabled={createBookmark.isPending}
      aria-pressed={isSaved}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn(
        "h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground",
        isSaved && "text-primary hover:text-primary",
        className,
      )}
    >
      <Bookmark
        className={cn("h-4 w-4", isSaved && "fill-current")}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </Button>
  ) : (
    <Button
      type="button"
      variant={isSaved ? "secondary" : "outline"}
      size={size}
      onClick={handleToggle}
      disabled={createBookmark.isPending}
      aria-pressed={isSaved}
      aria-label={ariaLabel}
      className={cn("gap-2", className)}
    >
      {isSaved ? (
        <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
      ) : (
        <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      <span>{isSaved ? "저장됨" : "보관함에 콕 담기"}</span>
    </Button>
  );

  if (!isAuthenticated) {
    return triggerButton;
  }

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
