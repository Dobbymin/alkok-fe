"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const SIDEBAR_STORAGE_KEY = "alkok-sidebar-storage";

export interface SidebarState {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
      setCollapsed: (collapsed) => set({ collapsed }),
    }),
    {
      name: SIDEBAR_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ collapsed: state.collapsed }),
      skipHydration: true,
    },
  ),
);

export function resetSidebarStore(): void {
  useSidebarStore.setState({ collapsed: false });
  if (typeof window !== "undefined") {
    useSidebarStore.persist.clearStorage();
  }
}
