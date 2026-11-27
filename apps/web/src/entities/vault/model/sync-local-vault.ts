"use client";

import type { QueryClient } from "@tanstack/react-query";
import { ApiError, VAULT_QUERY_KEYS } from "@alkok/core";
import { vaultApi } from "../api/vault.api";
import { useLocalVaultStore } from "./local-vault.store";

export interface SyncLocalVaultResult {
  syncedCount: number;
  skippedCount: number;
  failedCount: number;
}

export async function syncLocalVaultToServer(
  queryClient?: QueryClient,
): Promise<SyncLocalVaultResult> {
  const { items, removeItem } = useLocalVaultStore.getState();
  if (items.length === 0) {
    return { syncedCount: 0, skippedCount: 0, failedCount: 0 };
  }

  const outcomes = await Promise.all(
    [...items].map(async (item): Promise<"synced" | "skipped" | "failed"> => {
      try {
        await vaultApi.createBookmark({
          contentId: item.contentId,
          ...(item.memo ? { memo: item.memo } : {}),
        });
        removeItem(item.contentId);
        return "synced";
      } catch (err) {
        if (
          err instanceof ApiError &&
          (err.statusCode === 409 || err.statusCode === 404)
        ) {
          removeItem(item.contentId);
          return "skipped";
        }
        return "failed";
      }
    }),
  );

  let syncedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  for (const outcome of outcomes) {
    if (outcome === "synced") syncedCount += 1;
    else if (outcome === "skipped") skippedCount += 1;
    else failedCount += 1;
  }

  if (syncedCount > 0 && queryClient) {
    void queryClient.invalidateQueries({ queryKey: VAULT_QUERY_KEYS.all() });
  }

  return { syncedCount, skippedCount, failedCount };
}
