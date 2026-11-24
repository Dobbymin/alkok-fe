import { Suspense } from "react";
import { LoginForm } from "@/features/auth-forms";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-80 w-full max-w-md rounded-lg bg-muted/40" />}>
      <LoginForm />
    </Suspense>
  );
}
