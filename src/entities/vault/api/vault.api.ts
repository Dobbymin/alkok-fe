import { apiClient } from "@/shared/api";
import type { ApiEnvelope } from "@/shared/types";
import type {
  CreateBookmarkInput,
  CreateExternalUrlInput,
  UpdateVaultItemInput,
  VaultFolder,
  VaultItem,
  VaultItemsFilter,
  VaultPreviewResult,
  VaultTag,
} from "../model/vault.types";

export const vaultApi = {
  listItems: (filters: VaultItemsFilter = {}) =>
    apiClient.get<ApiEnvelope<VaultItem[]>>("/api/v1/vault/items", {
      params: {
        folderId: filters.folderId,
        tag: filters.tag,
        itemType: filters.itemType,
        q: filters.q,
        page: filters.page,
        limit: filters.limit,
      },
    }),

  createBookmark: (input: CreateBookmarkInput) =>
    apiClient.post<ApiEnvelope<VaultItem>>("/api/v1/vault/items/bookmark", input),

  previewUrl: (url: string) =>
    apiClient.post<ApiEnvelope<VaultPreviewResult>>("/api/v1/vault/preview-url", {
      url,
    }),

  createExternalUrl: (input: CreateExternalUrlInput) =>
    apiClient.post<ApiEnvelope<VaultItem>>(
      "/api/v1/vault/items/external-url",
      input,
    ),

  updateItem: (id: string, input: UpdateVaultItemInput) =>
    apiClient.patch<ApiEnvelope<VaultItem>>(`/api/v1/vault/items/${id}`, input),

  deleteItem: (id: string) =>
    apiClient.delete<ApiEnvelope<{ deleted: boolean }>>(`/api/v1/vault/items/${id}`),

  listFolders: () =>
    apiClient.get<ApiEnvelope<VaultFolder[]>>("/api/v1/vault/folders"),

  createFolder: (name: string) =>
    apiClient.post<ApiEnvelope<VaultFolder>>("/api/v1/vault/folders", { name }),

  updateFolder: (id: string, name: string) =>
    apiClient.patch<ApiEnvelope<VaultFolder>>(`/api/v1/vault/folders/${id}`, {
      name,
    }),

  deleteFolder: (id: string) =>
    apiClient.delete<ApiEnvelope<{ deleted: boolean }>>(`/api/v1/vault/folders/${id}`),

  listTags: () => apiClient.get<ApiEnvelope<VaultTag[]>>("/api/v1/vault/tags"),

  deleteTag: (id: string) =>
    apiClient.delete<ApiEnvelope<{ deleted: boolean }>>(`/api/v1/vault/tags/${id}`),
};
