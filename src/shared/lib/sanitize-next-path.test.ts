import { describe, expect, it } from "vitest";
import { sanitizeNextPath } from "./sanitize-next-path";

describe("sanitizeNextPath", () => {
  it("allows safe internal relative paths", () => {
    expect(sanitizeNextPath("/vault")).toBe("/vault");
    expect(sanitizeNextPath("/guides/chatgpt-doc?tab=1")).toBe(
      "/guides/chatgpt-doc?tab=1",
    );
  });

  it("rejects open redirect attempts and falls back to /", () => {
    expect(sanitizeNextPath(null)).toBe("/");
    expect(sanitizeNextPath("")).toBe("/");
    expect(sanitizeNextPath("https://evil.com")).toBe("/");
    expect(sanitizeNextPath("//evil.com/path")).toBe("/");
    expect(sanitizeNextPath("/\\evil.com")).toBe("/");
    expect(sanitizeNextPath("vault")).toBe("/");
  });
});
