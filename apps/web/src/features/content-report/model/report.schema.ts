import { z } from "zod";
import { optionalEmailSchema, trimmedRequiredString } from "@alkok/core";

export const reportSchema = z.object({
  reason: z.enum([
    "PRICING_CHANGED",
    "BROKEN_LINK",
    "CONTENT_ERROR",
    "OUTDATED_OTHER",
  ]),
  detail: trimmedRequiredString("상세 내용을 입력해 주세요.", {
    max: 1000,
    message: "상세 내용은 1,000자 이하로 입력해 주세요.",
  }),
  reporterEmail: optionalEmailSchema,
  website: z.string(),
});
export type ReportFormValues = z.infer<typeof reportSchema>;
