import { Suspense } from "react";
import { VerifyEmailPanel } from "@/features/auth-forms";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="h-64 w-full max-w-md rounded-lg bg-muted/40" />}>
      <VerifyEmailPanel />
    </Suspense>
  );
}
