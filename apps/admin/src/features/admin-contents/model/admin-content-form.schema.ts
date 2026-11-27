import { z } from "zod";
import { httpUrlSchema, trimmedRequiredString } from "@alkok/core";

export const adminContentFormSchema = z
  .object({
    type: z.enum(["GUIDE", "TOOL", "SKILL", "NEWS"]),
    publishStatus: z.enum([
      "DRAFT",
      "IN_REVIEW",
      "PUBLISHED",
      "ARCHIVED",
      "REJECTED",
    ]),
    sourceType: z.enum(["OFFICIAL", "MEDIA", "COMMUNITY"]),
    title: trimmedRequiredString("제목을 입력해 주세요.", {
      max: 200,
      message: "제목은 200자 이하로 입력해 주세요.",
    }),
    summary: trimmedRequiredString("요약을 입력해 주세요.", {
      max: 500,
      message: "요약은 500자 이하로 입력해 주세요.",
    }),
    sourceUrl: httpUrlSchema("원문/공식 출처 URL을 입력해 주세요."),
    difficulty: z.enum(["BEGINNER", "PRACTICAL", "ADVANCED"]),
    pricingModel: z.enum(["FREE", "FREEMIUM", "PAID"]),
    markdownBody: z.string(),
    promptContent: z.string(),
    toolKind: z.enum(["TOOL", "MODEL"]),
    providerName: z.string(),
    pricingSummary: z.string(),
    koreanSupport: z.enum(["FULL", "PARTIAL", "NONE"]),
    keyPointsRaw: z.string(),
    workImpact: z.string(),
    skillKind: z.enum(["SKILL", "PLUGIN", "MCP"]),
    skillSlug: z.string().trim(),
    authorName: z.string(),
    license: z.string(),
    compatibleAgentsRaw: z.string(),
    overview: z.string(),
    installPrompt: z.string(),
    useCasesRaw: z.string(),
    tipsRaw: z.string(),
    tagsRaw: z.string(),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === "SKILL" &&
      data.skillSlug &&
      !/^[a-z0-9-]+$/.test(data.skillSlug)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["skillSlug"],
        message: "스킬 슬러그는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있어요.",
      });
    }
  });

export type AdminContentFormValues = z.infer<typeof adminContentFormSchema>;
