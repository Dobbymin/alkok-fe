import { z } from "zod";
import { httpUrlSchema, trimmedRequiredString } from "@alkok/core";

export const sourceFormSchema = z.object({
  name: trimmedRequiredString("출처명을 입력해 주세요.", {
    max: 100,
    message: "출처명은 100자 이하로 입력해 주세요.",
  }),
  feedUrl: httpUrlSchema("Feed URL을 입력해 주세요."),
  sourceType: z.enum(["OFFICIAL", "MEDIA", "COMMUNITY"]),
  fetchIntervalHours: z
    .number({ error: "수집 주기를 숫자로 입력해 주세요." })
    .int("수집 주기는 정수로 입력해 주세요.")
    .min(1, "수집 주기는 1시간 이상이어야 해요.")
    .max(168, "수집 주기는 168시간 이하로 입력해 주세요."),
});
export type SourceFormValues = z.infer<typeof sourceFormSchema>;
