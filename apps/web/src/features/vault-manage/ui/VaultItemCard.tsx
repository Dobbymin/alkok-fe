"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Folder, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useDeleteVaultItemMutation,
  useUpdateVaultItemMutation,
  type VaultFolder,
  type VaultItem,
} from "@/entities/vault";
import { parseCommaSeparated } from "@alkok/core";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FieldGroup,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  toast,
} from "@alkok/ui";
import {
  createVaultItemEditSchema,
  type VaultItemEditFormValues,
} from "../model/vault-manage.schema";

const UNCLASSIFIED_FOLDER_VALUE = "__UNCLASSIFIED__";

export interface VaultItemCardProps {
  item: VaultItem;
  folders: VaultFolder[];
}

const getInternalHref = (item: VaultItem) => {
  const slug = item.content?.slug;
  if (!slug) return "/";
  const type = item.content?.type;
  if (type === "TOOL") return `/tools/${slug}`;
  if (type === "SKILL") return `/skills/${slug}`;
  if (type === "NEWS") return `/news/${slug}`;
  return `/guides/${slug}`;
};

export const VaultItemCard = ({ item, folders }: VaultItemCardProps) => {
  const [editOpen, setEditOpen] = useState(false);

  const updateMutation = useUpdateVaultItemMutation();
  const deleteMutation = useDeleteVaultItemMutation();

  const isExternal = item.itemType === "EXTERNAL_URL";
  const href = isExternal ? item.externalUrl ?? "#" : getInternalHref(item);
  const schema = useMemo(
    () => createVaultItemEditSchema(isExternal),
    [isExternal],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VaultItemEditFormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      title: item.title,
      folderId: item.folderId ?? "",
      memo: item.memo ?? "",
      tagsText: item.tags.map((t) => t.name).join(", "),
    },
  });

  useEffect(() => {
    if (!editOpen) return;
    reset({
      title: item.title,
      folderId: item.folderId ?? "",
      memo: item.memo ?? "",
      tagsText: item.tags.map((t) => t.name).join(", "),
    });
  }, [editOpen, item, reset]);

  const handleSave = async (values: VaultItemEditFormValues) => {
    const tagNames = parseCommaSeparated(values.tagsText);
    try {
      await updateMutation.mutateAsync({
        id: item.id,
        input: {
          title: isExternal ? values.title.trim() : undefined,
          folderId: values.folderId || null,
          memo: values.memo.trim() || null,
          tagNames,
        },
      });
      setEditOpen(false);
      toast.success("보관함 항목이 수정되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(item.id);
      toast.success("보관함에서 삭제되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    }
  };

  return (
    <Card className="flex flex-col justify-between transition-colors duration-150 ease-out hover:bg-surface-sunken">
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={isExternal ? "outline" : "secondary"}>
            {isExternal ? "외부 링크" : "알콕 콘텐츠"}
          </Badge>
          {item.folderName ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Folder className="h-3 w-3" aria-hidden="true" />
              {item.folderName}
            </span>
          ) : null}
        </div>
        <CardTitle className="text-base leading-snug">
          {isExternal ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:underline"
            >
              <span>{item.title}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </a>
          ) : (
            <Link href={href} className="hover:underline">
              {item.title}
            </Link>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {item.summary ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {item.summary}
          </p>
        ) : null}

        {item.memo ? (
          <p className="rounded-md bg-surface-sunken px-3 py-2 text-xs text-foreground">
            {item.memo}
          </p>
        ) : null}

        {item.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {item.tags.map((t) => (
              <Badge key={t.id} variant="outline" className="text-[11px]">
                #{t.name}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-1 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setEditOpen(true)}
            aria-label={`${item.title} 편집`}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            편집
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            aria-label={`${item.title} 삭제`}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            삭제
          </Button>
        </div>
      </CardContent>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>보관함 항목 편집</DialogTitle>
          </DialogHeader>
          <form
            noValidate
            onSubmit={handleSubmit(handleSave)}
            className="flex flex-col gap-3"
          >
            {isExternal ? (
              <FieldGroup
                htmlFor={`edit-title-${item.id}`}
                label="제목"
                required
                error={errors.title?.message}
                errorId={`edit-title-error-${item.id}`}
              >
                <Input
                  id={`edit-title-${item.id}`}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={
                    errors.title ? `edit-title-error-${item.id}` : undefined
                  }
                  {...register("title")}
                />
              </FieldGroup>
            ) : null}
            <FieldGroup htmlFor={`edit-folder-${item.id}`} label="폴더">
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
                      id={`edit-folder-${item.id}`}
                      className="h-9 bg-background text-sm"
                    >
                      <SelectValue />
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
              htmlFor={`edit-tags-${item.id}`}
              label="태그 (쉼표 구분)"
              error={errors.tagsText?.message}
              errorId={`edit-tags-error-${item.id}`}
            >
              <Input
                id={`edit-tags-${item.id}`}
                aria-invalid={Boolean(errors.tagsText)}
                aria-describedby={
                  errors.tagsText ? `edit-tags-error-${item.id}` : undefined
                }
                {...register("tagsText")}
              />
            </FieldGroup>
            <FieldGroup
              htmlFor={`edit-memo-${item.id}`}
              label="메모"
              error={errors.memo?.message}
              errorId={`edit-memo-error-${item.id}`}
            >
              <Textarea
                id={`edit-memo-${item.id}`}
                rows={3}
                aria-invalid={Boolean(errors.memo)}
                aria-describedby={
                  errors.memo ? `edit-memo-error-${item.id}` : undefined
                }
                {...register("memo")}
              />
            </FieldGroup>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(false)}
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
    </Card>
  );
};
