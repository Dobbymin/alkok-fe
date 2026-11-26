"use client";

import { Folder, FolderPlus, Pencil, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  useCreateVaultFolderMutation,
  useDeleteVaultFolderMutation,
  useRenameVaultFolderMutation,
  type VaultFolder,
} from "@/entities/vault";
import { cn } from "@alkok/core";
import { Button, Input, Skeleton } from "@alkok/ui";

export interface VaultFolderSidebarProps {
  folders: VaultFolder[];
  selectedFolderId: string;
  onSelectFolder: (folderId: string) => void;
  isLoading?: boolean;
}

export const VaultFolderSidebar = ({
  folders,
  selectedFolderId,
  onSelectFolder,
  isLoading = false,
}: VaultFolderSidebarProps) => {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const createFolder = useCreateVaultFolderMutation();
  const renameFolder = useRenameVaultFolderMutation();
  const deleteFolder = useDeleteVaultFolderMutation();

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await createFolder.mutateAsync(newName.trim());
      setNewName("");
      toast.success("폴더가 생성되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "폴더 생성 실패");
    }
  };

  const handleRename = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId || !editingName.trim()) return;
    try {
      await renameFolder.mutateAsync({ id: editingId, name: editingName.trim() });
      setEditingId(null);
      setEditingName("");
      toast.success("폴더 이름이 변경되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "폴더 이름 변경 실패");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFolder.mutateAsync(id);
      if (selectedFolderId === id) {
        onSelectFolder("");
      }
      toast.success("폴더가 삭제되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "폴더 삭제 실패");
    }
  };

  return (
    <aside className="flex flex-col gap-3 rounded-xl border border-transparent bg-surface-sunken p-3 dark:border-border">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-muted-foreground">
          폴더 (1단계)
        </h2>
      </div>

      <form onSubmit={handleCreate} className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="새 폴더 이름"
          aria-label="새 폴더 이름"
          className="h-8 text-xs"
        />
        <Button
          type="submit"
          variant="outline"
          size="sm"
          disabled={createFolder.isPending || !newName.trim()}
          aria-label="폴더 추가"
          className="h-8 px-3"
        >
          <FolderPlus className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </form>

      {/* Mobile selector */}
      <div className="md:hidden">
        <select
          aria-label="폴더 선택"
          value={selectedFolderId}
          onChange={(e) => onSelectFolder(e.target.value)}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">전체 항목</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop list */}
      <nav aria-label="보관함 폴더" className="hidden flex-col gap-1 md:flex">
        <button
          type="button"
          onClick={() => onSelectFolder("")}
          className={cn(
            "flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
            selectedFolderId === ""
              ? "bg-accent font-medium text-accent-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          <span className="flex items-center gap-2">
            <Folder className="h-4 w-4" aria-hidden="true" />
            전체 항목
          </span>
        </button>

        {isLoading && folders.length === 0 ? (
          <div role="status" aria-label="폴더 목록 불러오는 중" className="flex flex-col gap-1">
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
            <span className="sr-only">폴더 목록을 불러오고 있습니다.</span>
          </div>
        ) : (
          folders.map((folder) =>
            editingId === folder.id ? (
              <form
                key={folder.id}
                onSubmit={handleRename}
                className="flex items-center gap-1 py-1"
              >
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="h-8 text-xs"
                  autoFocus
                />
                <Button type="submit" size="sm" className="h-8 px-2 text-xs">
                  확인
                </Button>
              </form>
            ) : (
              <div
                key={folder.id}
                className={cn(
                  "group flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  selectedFolderId === folder.id
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectFolder(folder.id)}
                  className="flex flex-1 items-center gap-2 truncate text-left"
                >
                  <Folder className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{folder.name}</span>
                </button>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                  <button
                    type="button"
                    aria-label={`${folder.name} 이름 변경`}
                    onClick={() => {
                      setEditingId(folder.id);
                      setEditingName(folder.name);
                    }}
                    className="rounded p-1 hover:bg-background"
                  >
                    <Pencil className="h-3 w-3" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`${folder.name} 삭제`}
                    onClick={() => handleDelete(folder.id)}
                    className="rounded p-1 text-destructive hover:bg-background"
                  >
                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ),
          )
        )}
      </nav>
    </aside>
  );
};
