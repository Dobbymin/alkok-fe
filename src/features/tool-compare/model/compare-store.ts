"use client";

import { useSyncExternalStore } from "react";

export interface CompareSelectionItem {
  slug: string;
  title: string;
}

let selectedItems: CompareSelectionItem[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export function getCompareMaxLimit(isMobile?: boolean): number {
  if (typeof isMobile === "boolean") return isMobile ? 3 : 4;
  if (typeof window !== "undefined" && window.innerWidth < 768) return 3;
  return 4;
}

export const compareStore = {
  getSnapshot: () => selectedItems,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  toggle(item: CompareSelectionItem, isMobile?: boolean): boolean {
    const exists = selectedItems.some((i) => i.slug === item.slug);
    if (exists) {
      selectedItems = selectedItems.filter((i) => i.slug !== item.slug);
      emit();
      return true;
    }
    const max = getCompareMaxLimit(isMobile);
    if (selectedItems.length >= max) {
      return false;
    }
    selectedItems = [...selectedItems, item];
    emit();
    return true;
  },
  remove(slug: string) {
    selectedItems = selectedItems.filter((i) => i.slug !== slug);
    emit();
  },
  clear() {
    selectedItems = [];
    emit();
  },
};

export function useCompareSelection() {
  return useSyncExternalStore(
    compareStore.subscribe,
    compareStore.getSnapshot,
    () => [],
  );
}
