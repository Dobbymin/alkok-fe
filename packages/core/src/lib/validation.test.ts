import { describe, expect, it } from "vitest";
import {
  emailSchema,
  httpUrlSchema,
  loginPasswordSchema,
  nicknameSchema,
  optionalEmailSchema,
  parseCommaSeparated,
  parseNewlineSeparated,
  passwordSchema,
  trimmedRequiredString,
} from "./validation";

describe("validation helpers", () => {
  it("validates trimmedRequiredString with optional maxLength", () => {
    const schema = trimmedRequiredString("필수 입력이에요.", {
      max: 5,
      message: "5자 이하로 입력해 주세요.",
    });
    expect(schema.safeParse("   ").success).toBe(false);
    expect(schema.safeParse("  abc ").success).toBe(true);
    expect(schema.safeParse("abcdef").success).toBe(false);
  });

  it("validates emailSchema and optionalEmailSchema", () => {
    expect(emailSchema.safeParse(" user@example.com ").success).toBe(true);
    expect(emailSchema.safeParse("bad-email").success).toBe(false);
    expect(optionalEmailSchema.safeParse("").success).toBe(true);
    expect(optionalEmailSchema.safeParse("   ").success).toBe(true);
    expect(optionalEmailSchema.safeParse("invalid").success).toBe(false);
    expect(optionalEmailSchema.safeParse("user@example.com").success).toBe(true);
  });

  it("validates passwordSchema, loginPasswordSchema, and nicknameSchema", () => {
    expect(passwordSchema.safeParse("1234567").success).toBe(false);
    expect(passwordSchema.safeParse("12345678").success).toBe(true);
    expect(loginPasswordSchema.safeParse("").success).toBe(false);
    expect(loginPasswordSchema.safeParse("1234").success).toBe(true);
    expect(nicknameSchema.safeParse("a").success).toBe(false);
    expect(nicknameSchema.safeParse("알콕").success).toBe(true);
    expect(nicknameSchema.safeParse("a".repeat(31)).success).toBe(false);
  });

  it("validates httpUrlSchema for http/https including localhost/IP", () => {
    const schema = httpUrlSchema();
    expect(schema.safeParse("").success).toBe(false);
    expect(schema.safeParse("ftp://example.com").success).toBe(false);
    expect(schema.safeParse("javascript:alert(1)").success).toBe(false);
    expect(schema.safeParse("https://example.com/path").success).toBe(true);
    expect(schema.safeParse("http://127.0.0.1/secret").success).toBe(true);
  });

  it("parses comma and newline separated strings", () => {
    expect(parseCommaSeparated(" React, Next.js , , ", true)).toEqual([
      "react",
      "next.js",
    ]);
    expect(parseNewlineSeparated("a\n\nb\nc\nd", 3)).toEqual(["a", "b", "c"]);
  });
});
