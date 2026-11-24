import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("merges conflicting Tailwind classes cleanly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("ignores falsy values", () => {
    const isHidden = false as boolean;
    expect(cn("text-sm", isHidden && "hidden", undefined, "font-medium")).toBe(
      "text-sm font-medium",
    );
  });
});
