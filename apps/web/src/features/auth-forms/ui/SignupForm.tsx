"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
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
import { useSignupMutation } from "../model/useAuthMutations";

export const SignupForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const signupMutation = useSignupMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setErrorMsg("필수 이용약관에 동의해 주세요.");
      return;
    }
    setErrorMsg(null);
    await signupMutation.mutateAsync({
      email: email.trim(),
      password,
      nickname: nickname.trim(),
    });
    router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>
          이메일 인증 후 개인 지식 보관함을 이용할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup
            htmlFor="signup-email"
            label="이메일"
            required
            error={errorMsg ?? undefined}
            errorId="signup-error"
          >
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FieldGroup>

          <FieldGroup htmlFor="signup-nickname" label="닉네임" required>
            <Input
              id="signup-nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </FieldGroup>

          <FieldGroup
            htmlFor="signup-password"
            label="비밀번호"
            required
            hint="8자 이상 입력해 주세요."
          >
            <Input
              id="signup-password"
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FieldGroup>

          <div className="flex items-center gap-2">
            <Checkbox
              id="signup-terms"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(v === true)}
            />
            <Label htmlFor="signup-terms" className="text-xs font-normal">
              (필수) 알콕 서비스 이용약관 및 개인정보 처리방침에 동의합니다.
            </Label>
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
