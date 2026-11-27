import { z } from "zod";
import {
  emailSchema,
  loginPasswordSchema,
  nicknameSchema,
  passwordSchema,
} from "@alkok/core";

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: emailSchema,
  nickname: nicknameSchema,
  password: passwordSchema,
  agreed: z.boolean().refine((v) => v === true, {
    message: "필수 이용약관에 동의해 주세요.",
  }),
});
export type SignupFormValues = z.infer<typeof signupSchema>;

export const resetPasswordRequestSchema = z.object({
  email: emailSchema,
});
export type ResetPasswordRequestFormValues = z.infer<
  typeof resetPasswordRequestSchema
>;

export const resetPasswordConfirmSchema = z.object({
  newPassword: passwordSchema,
});
export type ResetPasswordConfirmFormValues = z.infer<
  typeof resetPasswordConfirmSchema
>;

export const updateProfileSchema = z.object({
  nickname: nicknameSchema,
});
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: loginPasswordSchema,
  newPassword: passwordSchema,
});
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
