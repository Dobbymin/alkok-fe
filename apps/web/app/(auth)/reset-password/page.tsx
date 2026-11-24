import type { Metadata } from "next";
import { ResetPasswordPage } from "@/views/auth";

export const metadata: Metadata = {
  title: "비밀번호 재설정",
};

export default function Page() {
  return <ResetPasswordPage />;
}
