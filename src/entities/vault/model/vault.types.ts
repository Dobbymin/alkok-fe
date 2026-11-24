import type { ContentSummary, VaultItemType } from "@/shared/types";

export interface VaultFolder {
  id: string;
  name: string;
  itemCount?: number;
  createdAt?: string;
}

export interface VaultTag {
  id: string;
  name: string;
  itemCount?: number;
}

export interface VaultItem {
  id: string;
  itemType: VaultItemType;
  contentId?: string | null;
  content?: ContentSummary | null;
  externalUrl?: string | null;
  title: string;
  summary?: string | null;
  thumbnailUrl?: string | null;
  memo?: string | null;
  folderId?: string | null;
  folderName?: string | null;
  tags: VaultTag[];
  createdAt: string;
  updatedAt?: string;
}

export interface VaultPreviewResult {
  url: string;
  title?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  fallback: boolean;
}

export interface VaultItemsFilter {
  folderId?: string;
  tag?: string;
  itemType?: VaultItemType;
  q?: string;
  page?: number;
  limit?: number;
}

export interface CreateBookmarkInput {
  contentId: string;
  folderId?: string | null;
  memo?: string;
  tagNames?: string[];
}

export interface CreateExternalUrlInput {
  url: string;
  title: string;
  summary?: string;
  thumbnailUrl?: string | null;
  folderId?: string | null;
  memo?: string;
  tagNames?: string[];
}

export interface UpdateVaultItemInput {
  title?: string;
  memo?: string | null;
  folderId?: string | null;
  tagNames?: string[];
}
