import type { Metadata } from "next";
import { Suspense } from "react";
import { ToolComparePage } from "@/views/tools";

export const metadata: Metadata = {
  title: "AI 도구·모델 비교표",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <Suspense>
      <ToolComparePage />
    </Suspense>
  );
}
