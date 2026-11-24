import { Suspense } from "react";
import { SignupForm } from "@/features/auth-forms";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="h-96 w-full max-w-md rounded-lg bg-muted/40" />}>
      <SignupForm />
    </Suspense>
  );
}
