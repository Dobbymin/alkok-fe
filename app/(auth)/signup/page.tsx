import type { Metadata } from "next";
import { SignupPage } from "@/views/auth";

export const metadata: Metadata = {
  title: "회원가입",
};

export default function Page() {
  return <SignupPage />;
}
