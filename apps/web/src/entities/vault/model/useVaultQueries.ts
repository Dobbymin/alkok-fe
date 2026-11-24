"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { VAULT_QUERY_KEYS } from "@alkok/core";
import { vaultApi } from "../api/vault.api";
import type {
  CreateBookmarkInput,
  CreateExternalUrlInput,
  UpdateVaultItemInput,
  VaultItemsFilter,
} from "./vault.types";

export const useVaultItemsQuery = (
  filters: VaultItemsFilter = {},
  enabled = true,
) =>
  useQuery({
    queryKey: VAULT_QUERY_KEYS.list(filters as Record<string, unknown>),
    queryFn: () => vaultApi.listItems(filters),
    enabled,
  });

export const useVaultFoldersQuery = (enabled = true) =>
  useQuery({
    queryKey: VAULT_QUERY_KEYS.folders(),
    queryFn: () => vaultApi.listFolders(),
    enabled,
  });

export const useVaultTagsQuery = (enabled = true) =>
  useQuery({
    queryKey: VAULT_QUERY_KEYS.tags(),
    queryFn: () => vaultApi.listTags(),
    enabled,
  });

export const useCreateBookmarkMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBookmarkInput) => vaultApi.createBookmark(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: VAULT_QUERY_KEYS.all() });
    },
  });
};

export const usePreviewExternalUrlMutation = () =>
  useMutation({
    mutationFn: (url: string) => vaultApi.previewUrl(url),
  });

export const useCreateExternalUrlMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateExternalUrlInput) => vaultApi.createExternalUrl(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: VAULT_QUERY_KEYS.all() });
    },
  });
};

export const useUpdateVaultItemMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateVaultItemInput }) =>
      vaultApi.updateItem(id, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: VAULT_QUERY_KEYS.all() });
    },
  });
};

export const useDeleteVaultItemMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vaultApi.deleteItem(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: VAULT_QUERY_KEYS.all() });
    },
  });
};

export const useCreateVaultFolderMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => vaultApi.createFolder(name),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: VAULT_QUERY_KEYS.folders() });
    },
  });
};

export const useRenameVaultFolderMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      vaultApi.updateFolder(id, name),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: VAULT_QUERY_KEYS.all() });
    },
  });
};

export const useDeleteVaultFolderMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vaultApi.deleteFolder(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: VAULT_QUERY_KEYS.all() });
    },
  });
};

export const useDeleteVaultTagMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vaultApi.deleteTag(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: VAULT_QUERY_KEYS.all() });
    },
  });
};
