import type { Metadata } from "next";
import { SettingsPage } from "@/views/settings";

export const metadata: Metadata = {
  title: "계정 설정",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <SettingsPage />;
}
