"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const MAX_RECENT = 6;
export const QUICK_SEARCH_STORAGE_KEY = "alkok-quick-search-storage";

export interface QuickSearchState {
  open: boolean;
  recentSearches: string[];
  openModal: () => void;
  closeModal: () => void;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
}

export const useQuickSearchStore = create<QuickSearchState>()(
  persist(
    (set) => ({
      open: false,
      recentSearches: [],
      openModal: () => set({ open: true }),
      closeModal: () => set({ open: false }),
      setOpen: (open) => set({ open }),
      toggleOpen: () => set((state) => ({ open: !state.open })),
      addRecentSearch: (term) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        set((state) => ({
          recentSearches: [
            trimmed,
            ...state.recentSearches.filter((item) => item !== trimmed),
          ].slice(0, MAX_RECENT),
        }));
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: QUICK_SEARCH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ recentSearches: state.recentSearches }),
      skipHydration: true,
    },
  ),
);

export function resetQuickSearchStore(): void {
  useQuickSearchStore.setState({ open: false, recentSearches: [] });
  if (typeof window !== "undefined") {
    useQuickSearchStore.persist.clearStorage();
  }
}
