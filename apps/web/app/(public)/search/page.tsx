import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "@/views/search";
import SearchLoading from "./loading";

export const metadata: Metadata = {
  title: "통합 검색",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchPage />
    </Suspense>
  );
}
