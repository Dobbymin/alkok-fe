import { z } from "zod";

export const adminReportFormSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "DISMISSED"]),
  resolutionMemo: z
    .string()
    .trim()
    .max(500, "처리 메모는 500자 이하로 입력해 주세요."),
});
export type AdminReportFormValues = z.infer<typeof adminReportFormSchema>;
