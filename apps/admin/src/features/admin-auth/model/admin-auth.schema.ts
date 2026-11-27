import { z } from "zod";
import { emailSchema, loginPasswordSchema } from "@alkok/core";

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
