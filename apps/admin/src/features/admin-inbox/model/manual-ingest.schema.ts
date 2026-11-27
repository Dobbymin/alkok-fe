import { z } from "zod";
import { httpUrlSchema } from "@alkok/core";

export const manualIngestSchema = z.object({
  url: httpUrlSchema("수집할 원문 URL을 입력해 주세요."),
});
export type ManualIngestFormValues = z.infer<typeof manualIngestSchema>;
