export { vaultApi } from "./api/vault.api";
export {
  useCreateBookmarkMutation,
  useCreateExternalUrlMutation,
  useCreateVaultFolderMutation,
  useDeleteVaultFolderMutation,
  useDeleteVaultItemMutation,
  useDeleteVaultTagMutation,
  usePreviewExternalUrlMutation,
  useRenameVaultFolderMutation,
  useUpdateVaultItemMutation,
  useVaultFoldersQuery,
  useVaultItemsQuery,
  useVaultTagsQuery,
} from "./model/useVaultQueries";
export type {
  CreateBookmarkInput,
  CreateExternalUrlInput,
  UpdateVaultItemInput,
  VaultFolder,
  VaultItem,
  VaultItemsFilter,
  VaultPreviewResult,
  VaultTag,
} from "./model/vault.types";
