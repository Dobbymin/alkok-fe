import type { Metadata } from "next";
import { cookies } from "next/headers";
import { VaultPage } from "@/views/vault";

export const metadata: Metadata = {
  title: "내 보관함",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  const cookieStore = await cookies();
  const initialHasSessionHint = cookieStore.get("alkok_logged_in")?.value === "1";
  return <VaultPage initialHasSessionHint={initialHasSessionHint} />;
}
