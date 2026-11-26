import { beforeEach, describe, expect, it } from "vitest";
import {
  SIDEBAR_STORAGE_KEY,
  resetSidebarStore,
  useSidebarStore,
} from "./sidebar.store";

describe("useSidebarStore", () => {
  beforeEach(() => {
    resetSidebarStore();
  });

  it("toggles and sets collapsed state", () => {
    expect(useSidebarStore.getState().collapsed).toBe(false);

    useSidebarStore.getState().toggleCollapsed();
    expect(useSidebarStore.getState().collapsed).toBe(true);

    useSidebarStore.getState().setCollapsed(false);
    expect(useSidebarStore.getState().collapsed).toBe(false);
  });

  it("persists collapsed state to localStorage and rehydrates", async () => {
    useSidebarStore.getState().setCollapsed(true);

    const raw = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!).state).toEqual({ collapsed: true });

    useSidebarStore.setState({ collapsed: false });
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, raw!);
    await useSidebarStore.persist.rehydrate();
    expect(useSidebarStore.getState().collapsed).toBe(true);
  });
});
