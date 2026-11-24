import type { Metadata } from "next";
import { VaultPage } from "@/views/vault";

export const metadata: Metadata = {
  title: "내 보관함",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <VaultPage />;
}
