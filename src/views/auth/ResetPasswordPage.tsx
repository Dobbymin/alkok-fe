import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth-forms";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="h-80 w-full max-w-md rounded-lg bg-muted/40" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
