import { z } from "zod";
import { httpUrlSchema, trimmedRequiredString } from "@alkok/core";

export const externalUrlSchema = z.object({
  url: httpUrlSchema("저장할 URL을 입력해 주세요."),
  title: trimmedRequiredString("제목을 입력해 주세요.", {
    max: 200,
    message: "제목은 200자 이하로 입력해 주세요.",
  }),
  summary: z.string().trim().max(500, "설명은 500자 이하로 입력해 주세요."),
  folderId: z.string(),
  tagsText: z.string().max(200, "태그는 200자 이하로 입력해 주세요."),
  memo: z.string().trim().max(500, "메모는 500자 이하로 입력해 주세요."),
});
export type ExternalUrlFormValues = z.infer<typeof externalUrlSchema>;

export const bookmarkMetaSchema = z.object({
  folderId: z.string(),
  tagsText: z.string().max(200, "태그는 200자 이하로 입력해 주세요."),
  memo: z.string().trim().max(500, "메모는 500자 이하로 입력해 주세요."),
});
export type BookmarkMetaFormValues = z.infer<typeof bookmarkMetaSchema>;
