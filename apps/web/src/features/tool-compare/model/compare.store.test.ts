import { beforeEach, describe, expect, it } from "vitest";
import {
  COMPARE_STORAGE_KEY,
  resetCompareStore,
  useCompareStore,
} from "./compare.store";

describe("useCompareStore", () => {
  beforeEach(() => {
    resetCompareStore();
  });

  it("toggles, removes, and clears items", () => {
    const { toggle, remove, clear } = useCompareStore.getState();

    expect(toggle({ slug: "chatgpt", title: "ChatGPT" }, false)).toBe(true);
    expect(toggle({ slug: "claude", title: "Claude" }, false)).toBe(true);
    expect(useCompareStore.getState().selectedItems).toHaveLength(2);

    // Toggling existing item removes it
    expect(toggle({ slug: "chatgpt", title: "ChatGPT" }, false)).toBe(true);
    expect(useCompareStore.getState().selectedItems).toEqual([
      { slug: "claude", title: "Claude" },
    ]);

    remove("claude");
    expect(useCompareStore.getState().selectedItems).toHaveLength(0);

    toggle({ slug: "gemini", title: "Gemini" }, false);
    clear();
    expect(useCompareStore.getState().selectedItems).toHaveLength(0);
  });

  it("enforces max 3 items on mobile and max 4 items on desktop", () => {
    const { toggle } = useCompareStore.getState();

    expect(toggle({ slug: "a", title: "A" }, true)).toBe(true);
    expect(toggle({ slug: "b", title: "B" }, true)).toBe(true);
    expect(toggle({ slug: "c", title: "C" }, true)).toBe(true);
    expect(toggle({ slug: "d", title: "D" }, true)).toBe(false);

    expect(toggle({ slug: "d", title: "D" }, false)).toBe(true);
    expect(toggle({ slug: "e", title: "E" }, false)).toBe(false);
  });

  it("persists selectedItems to sessionStorage and rehydrates", async () => {
    useCompareStore.getState().toggle({ slug: "chatgpt", title: "ChatGPT" }, false);
    const raw = window.sessionStorage.getItem(COMPARE_STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!).state.selectedItems).toEqual([
      { slug: "chatgpt", title: "ChatGPT" },
    ]);

    useCompareStore.setState({ selectedItems: [] });
    window.sessionStorage.setItem(COMPARE_STORAGE_KEY, raw!);
    await useCompareStore.persist.rehydrate();
    expect(useCompareStore.getState().selectedItems).toEqual([
      { slug: "chatgpt", title: "ChatGPT" },
    ]);
  });
});
