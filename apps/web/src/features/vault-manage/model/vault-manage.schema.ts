import { z } from "zod";
import { trimmedRequiredString } from "@alkok/core";

export const createVaultItemEditSchema = (isExternal: boolean) =>
  z.object({
    title: isExternal
      ? trimmedRequiredString("제목을 입력해 주세요.", {
          max: 200,
          message: "제목은 200자 이하로 입력해 주세요.",
        })
      : z.string().trim().max(200, "제목은 200자 이하로 입력해 주세요."),
    folderId: z.string(),
    tagsText: z.string().max(200, "태그는 200자 이하로 입력해 주세요."),
    memo: z.string().trim().max(500, "메모는 500자 이하로 입력해 주세요."),
  });

export type VaultItemEditFormValues = z.infer<
  ReturnType<typeof createVaultItemEditSchema>
>;

export const vaultFolderNameSchema = z.object({
  name: trimmedRequiredString("폴더 이름을 입력해 주세요.", {
    max: 40,
    message: "폴더 이름은 40자 이하로 입력해 주세요.",
  }),
});
export type VaultFolderNameFormValues = z.infer<typeof vaultFolderNameSchema>;
