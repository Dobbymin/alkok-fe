import { beforeEach, describe, expect, it } from "vitest";
import {
  QUICK_SEARCH_STORAGE_KEY,
  resetQuickSearchStore,
  useQuickSearchStore,
} from "./quick-search.store";

describe("useQuickSearchStore", () => {
  beforeEach(() => {
    resetQuickSearchStore();
  });

  it("manages modal open state", () => {
    expect(useQuickSearchStore.getState().open).toBe(false);

    useQuickSearchStore.getState().openModal();
    expect(useQuickSearchStore.getState().open).toBe(true);

    useQuickSearchStore.getState().toggleOpen();
    expect(useQuickSearchStore.getState().open).toBe(false);

    useQuickSearchStore.getState().setOpen(true);
    expect(useQuickSearchStore.getState().open).toBe(true);

    useQuickSearchStore.getState().closeModal();
    expect(useQuickSearchStore.getState().open).toBe(false);
  });

  it("deduplicates, trims, and caps recentSearches at 6 items", () => {
    const { addRecentSearch, clearRecentSearches } =
      useQuickSearchStore.getState();

    addRecentSearch("   ");
    expect(useQuickSearchStore.getState().recentSearches).toEqual([]);

    for (const term of ["1", "2", "3", "4", "5", "6", "7"]) {
      addRecentSearch(term);
    }
    expect(useQuickSearchStore.getState().recentSearches).toEqual([
      "7",
      "6",
      "5",
      "4",
      "3",
      "2",
    ]);

    addRecentSearch("  3  ");
    expect(useQuickSearchStore.getState().recentSearches).toEqual([
      "3",
      "7",
      "6",
      "5",
      "4",
      "2",
    ]);

    clearRecentSearches();
    expect(useQuickSearchStore.getState().recentSearches).toEqual([]);
  });

  it("persists only recentSearches (excluding open) to localStorage and rehydrates", async () => {
    useQuickSearchStore.getState().openModal();
    useQuickSearchStore.getState().addRecentSearch("회의록");

    const raw = window.localStorage.getItem(QUICK_SEARCH_STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.state).toEqual({ recentSearches: ["회의록"] });
    expect(parsed.state.open).toBeUndefined();

    useQuickSearchStore.setState({ open: false, recentSearches: [] });
    window.localStorage.setItem(QUICK_SEARCH_STORAGE_KEY, raw!);
    await useQuickSearchStore.persist.rehydrate();
    expect(useQuickSearchStore.getState().recentSearches).toEqual(["회의록"]);
    expect(useQuickSearchStore.getState().open).toBe(false);
  });
});
