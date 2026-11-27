import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SonnerToaster, toast } from "./SonnerToaster";

const capturedProps: Array<Record<string, unknown>> = [];

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light" }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
  Toaster: (props: Record<string, unknown>) => {
    capturedProps.push(props);
    return (
      <div
        data-testid="mock-sonner"
        data-position={String(props.position)}
        data-theme={String(props.theme)}
      />
    );
  },
}));

describe("SonnerToaster", () => {
  afterEach(() => {
    capturedProps.length = 0;
    vi.restoreAllMocks();
  });

  it("uses bottom-right on desktop and top-center on mobile viewports", () => {
    let listener: ((e: MediaQueryListEvent) => void) | undefined;
    let matches = false;

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        get matches() {
          return matches;
        },
        addEventListener: (_event: string, cb: (e: MediaQueryListEvent) => void) => {
          listener = cb;
        },
        removeEventListener: vi.fn(),
      })),
    });

    render(<SonnerToaster />);

    const toaster = screen.getByTestId("mock-sonner");
    expect(toaster).toHaveAttribute("data-position", "bottom-right");
    expect(toaster).toHaveAttribute("data-theme", "light");

    const latest = capturedProps.at(-1);
    expect(latest?.richColors).toBeUndefined();
    expect(latest?.icons).toBeDefined();

    act(() => {
      matches = true;
      listener?.({ matches: true } as MediaQueryListEvent);
    });

    expect(screen.getByTestId("mock-sonner")).toHaveAttribute(
      "data-position",
      "top-center",
    );
  });

  it("re-exports toast from @alkok/ui", () => {
    toast.success("ok");
    expect(toast.success).toHaveBeenCalledWith("ok");
  });
});
