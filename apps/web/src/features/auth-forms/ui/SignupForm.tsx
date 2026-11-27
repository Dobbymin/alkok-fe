"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  FieldGroup,
  Input,
  Label,
} from "@alkok/ui";
import { signupSchema, type SignupFormValues } from "../model/auth-forms.schema";
import { useSignupMutation } from "../model/useAuthMutations";

export const SignupForm = () => {
  const router = useRouter();
  const signupMutation = useSignupMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
      agreed: false,
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await signupMutation.mutateAsync({
        email: values.email.trim(),
        password: values.password,
        nickname: values.nickname.trim(),
      });
      router.push(
        `/verify-email?email=${encodeURIComponent(values.email.trim())}`,
      );
    } catch {
      // Error toast handled in useSignupMutation
    }
  };

  return (
    <Card variant="surface" className="w-full max-w-md">
      <CardHeader>
        <CardTitle as="h1" className="text-xl">
          회원가입
        </CardTitle>
        <CardDescription>
          이메일 인증 후 개인 지식 보관함을 이용할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FieldGroup
            htmlFor="signup-email"
            label="이메일"
            required
            error={errors.email?.message}
            errorId="signup-email-error"
          >
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "signup-email-error" : undefined}
              {...register("email")}
            />
          </FieldGroup>

          <FieldGroup
            htmlFor="signup-nickname"
            label="닉네임"
            required
            error={errors.nickname?.message}
            errorId="signup-nickname-error"
          >
            <Input
              id="signup-nickname"
              autoComplete="nickname"
              aria-invalid={Boolean(errors.nickname)}
              aria-describedby={
                errors.nickname ? "signup-nickname-error" : undefined
              }
              {...register("nickname")}
            />
          </FieldGroup>

          <FieldGroup
            htmlFor="signup-password"
            label="비밀번호"
            required
            hint="8자 이상 입력해 주세요."
            error={errors.password?.message}
            errorId="signup-password-error"
          >
            <Input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "signup-password-error" : undefined
              }
              {...register("password")}
            />
          </FieldGroup>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Controller
                name="agreed"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="signup-terms"
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(v === true)}
                    aria-invalid={Boolean(errors.agreed)}
                    aria-describedby={
                      errors.agreed ? "signup-terms-error" : undefined
                    }
                  />
                )}
              />
              <Label htmlFor="signup-terms" className="text-xs font-normal">
                (필수) 알콕 서비스 이용약관 및 개인정보 처리방침에 동의합니다.
              </Label>
            </div>
            {errors.agreed ? (
              <p
                id="signup-terms-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {errors.agreed.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" disabled={signupMutation.isPending}>
            {signupMutation.isPending ? "가입 처리 중..." : "가입하기"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            이미 계정이 있나요?{" "}
            <Link href="/login" className="text-primary hover:underline">
              로그인
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
