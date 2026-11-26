"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CompareSelectionItem {
  slug: string;
  title: string;
}

export interface CompareState {
  selectedItems: CompareSelectionItem[];
  toggle: (item: CompareSelectionItem, isMobile?: boolean) => boolean;
  remove: (slug: string) => void;
  clear: () => void;
}

export const COMPARE_STORAGE_KEY = "alkok-compare-storage";

export function getCompareMaxLimit(isMobile?: boolean): number {
  if (typeof isMobile === "boolean") return isMobile ? 3 : 4;
  if (typeof window !== "undefined" && window.innerWidth < 768) return 3;
  return 4;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      selectedItems: [],
      toggle: (item, isMobile) => {
        const current = get().selectedItems;
        const exists = current.some((i) => i.slug === item.slug);
        if (exists) {
          set({ selectedItems: current.filter((i) => i.slug !== item.slug) });
          return true;
        }
        const max = getCompareMaxLimit(isMobile);
        if (current.length >= max) {
          return false;
        }
        set({ selectedItems: [...current, item] });
        return true;
      },
      remove: (slug) => {
        set((state) => ({
          selectedItems: state.selectedItems.filter((i) => i.slug !== slug),
        }));
      },
      clear: () => {
        set({ selectedItems: [] });
      },
    }),
    {
      name: COMPARE_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ selectedItems: state.selectedItems }),
      skipHydration: true,
    },
  ),
);

export function resetCompareStore(): void {
  useCompareStore.setState({ selectedItems: [] });
  if (typeof window !== "undefined") {
    useCompareStore.persist.clearStorage();
  }
}
