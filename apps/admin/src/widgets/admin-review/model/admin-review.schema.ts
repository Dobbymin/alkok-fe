import { z } from "zod";
import { trimmedRequiredString } from "@alkok/core";

export const adminReviewDraftSchema = z.object({
  title: trimmedRequiredString("제목을 입력해 주세요.", {
    max: 200,
    message: "제목은 200자 이하로 입력해 주세요.",
  }),
  summary: trimmedRequiredString("요약을 입력해 주세요.", {
    max: 500,
    message: "요약은 500자 이하로 입력해 주세요.",
  }),
  tagsRaw: z.string(),
  workImpact: z.string(),
  markdownBody: z.string(),
  pricingSummary: z.string(),
  overview: z.string(),
  installPrompt: z.string(),
  skillMdPreview: z.string(),
});
export type AdminReviewDraftFormValues = z.infer<typeof adminReviewDraftSchema>;
