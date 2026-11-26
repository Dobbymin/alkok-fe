"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ContentType } from "@alkok/core";

export const LOCAL_VAULT_STORAGE_KEY = "alkok-local-vault-storage";

export interface LocalVaultItem {
  contentId: string;
  title: string;
  contentType?: ContentType;
  slug?: string;
  summary?: string;
  memo?: string;
  savedAt: string;
}

export interface LocalVaultState {
  items: LocalVaultItem[];
  saveItem: (item: Omit<LocalVaultItem, "savedAt"> & { savedAt?: string }) => void;
  removeItem: (contentId: string) => void;
  updateMemo: (contentId: string, memo: string) => void;
  toggleItem: (item: Omit<LocalVaultItem, "savedAt">) => boolean;
  clearItems: () => void;
}

export const useLocalVaultStore = create<LocalVaultState>()(
  persist(
    (set, get) => ({
      items: [],
      saveItem: (item) => {
        const current = get().items;
        const exists = current.some((i) => i.contentId === item.contentId);
        if (exists) {
          set({
            items: current.map((i) =>
              i.contentId === item.contentId
                ? { ...i, ...item, savedAt: i.savedAt }
                : i,
            ),
          });
          return;
        }
        const nextItem: LocalVaultItem = {
          ...item,
          savedAt: item.savedAt ?? new Date().toISOString(),
        };
        set({ items: [nextItem, ...current] });
      },
      removeItem: (contentId) => {
        set((state) => ({
          items: state.items.filter((i) => i.contentId !== contentId),
        }));
      },
      updateMemo: (contentId, memo) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.contentId === contentId ? { ...i, memo } : i,
          ),
        }));
      },
      toggleItem: (item) => {
        const exists = get().items.some((i) => i.contentId === item.contentId);
        if (exists) {
          get().removeItem(item.contentId);
          return false;
        }
        get().saveItem(item);
        return true;
      },
      clearItems: () => {
        set({ items: [] });
      },
    }),
    {
      name: LOCAL_VAULT_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    },
  ),
);

export function resetLocalVaultStore(): void {
  useLocalVaultStore.setState({ items: [] });
  if (typeof window !== "undefined") {
    useLocalVaultStore.persist.clearStorage();
  }
}
