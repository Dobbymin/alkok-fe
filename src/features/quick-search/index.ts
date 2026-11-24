export { QuickSearchModal } from "./ui/QuickSearchModal";
export type { QuickSearchModalProps } from "./ui/QuickSearchModal";
export {
  searchApi,
  type SearchParams,
  type SearchResponsePayload,
  type SearchSuggestItem,
} from "./api/search.api";
export {
  useDebouncedValue,
  useSearchSuggest,
  useUnifiedSearch,
} from "./model/useQuickSearch";
