import type { Metadata } from "next";
import { VerifyEmailPage } from "@/views/auth";

export const metadata: Metadata = {
  title: "이메일 인증",
};

export default function Page() {
  return <VerifyEmailPage />;
}
