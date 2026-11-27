import { z } from "zod";

export const trimmedRequiredString = (
  requiredMessage: string,
  maxLength?: { max: number; message: string },
) => {
  const base = z.string().trim().min(1, requiredMessage);
  if (maxLength) {
    return base.max(maxLength.max, maxLength.message);
  }
  return base;
};

export const emailSchema = z
  .string()
  .trim()
  .min(1, "이메일을 입력해 주세요.")
  .email("올바른 이메일 형식을 입력해 주세요.");

export const optionalEmailSchema = z
  .string()
  .trim()
  .refine(
    (val) => val === "" || z.string().email().safeParse(val).success,
    "올바른 이메일 형식을 입력해 주세요.",
  );

export const passwordSchema = z
  .string()
  .min(1, "비밀번호를 입력해 주세요.")
  .min(8, "비밀번호는 8자 이상 입력해 주세요.");

export const loginPasswordSchema = z
  .string()
  .min(1, "비밀번호를 입력해 주세요.");

export const nicknameSchema = z
  .string()
  .trim()
  .min(1, "닉네임을 입력해 주세요.")
  .min(2, "닉네임은 2자 이상 입력해 주세요.")
  .max(30, "닉네임은 30자 이하로 입력해 주세요.");

export const httpUrlSchema = (
  requiredMessage = "URL을 입력해 주세요.",
) =>
  z
    .string()
    .trim()
    .min(1, requiredMessage)
    .refine((val) => {
      try {
        const parsed = new URL(val);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    }, "http:// 또는 https://로 시작하는 올바른 URL을 입력해 주세요.");

export const parseCommaSeparated = (raw: string, lowercase = false): string[] =>
  raw
    .split(",")
    .map((s) => (lowercase ? s.trim().toLowerCase() : s.trim()))
    .filter(Boolean);

export const parseNewlineSeparated = (raw: string, limit?: number): string[] => {
  const items = raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return typeof limit === "number" ? items.slice(0, limit) : items;
};
