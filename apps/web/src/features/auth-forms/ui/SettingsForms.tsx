"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { WORK_DOMAINS } from "@/entities/taxonomy";
import { useAuthStore } from "@alkok/core";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FieldGroup,
  Input,
  ToggleGroup,
  ToggleGroupItem,
  toast,
} from "@alkok/ui";
import { authApi } from "../api/auth.api";
import {
  changePasswordSchema,
  updateProfileSchema,
  type ChangePasswordFormValues,
  type UpdateProfileFormValues,
} from "../model/auth-forms.schema";
import { useDeleteAccountMutation } from "../model/useAuthMutations";

export const SettingsForms = () => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const { theme, setTheme } = useTheme();

  const [interests, setInterests] = useState<string[]>(
    user?.interestCategorySlugs ?? [],
  );
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteMutation = useDeleteAccountMutation();

  const profileForm = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      nickname: user?.nickname ?? "",
    },
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    profileForm.reset({ nickname: user?.nickname ?? "" });
  }, [user?.nickname, profileForm]);

  const handleSaveProfile = async (values: UpdateProfileFormValues) => {
    try {
      const res = await authApi.updateProfile(values.nickname.trim());
      updateUser(res.data);
      toast.success("프로필이 저장되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "프로필 저장에 실패했습니다.");
    }
  };

  const handleSaveInterests = async () => {
    try {
      const res = await authApi.updateInterests(interests);
      updateUser(res.data);
      toast.success("관심 업무 도메인이 저장되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "관심 도메인 저장에 실패했습니다.");
    }
  };

  const handleChangePassword = async (values: ChangePasswordFormValues) => {
    try {
      await authApi.updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      passwordForm.reset();
      toast.success("비밀번호가 변경되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "비밀번호 변경에 실패했습니다.");
    }
  };

  const handleConfirmDelete = async () => {
    await deleteMutation.mutateAsync();
    setDeleteOpen(false);
    router.replace("/");
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle as="h2">프로필 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            noValidate
            onSubmit={profileForm.handleSubmit(handleSaveProfile)}
            className="flex items-start gap-3"
          >
            <FieldGroup
              htmlFor="settings-nickname"
              label="닉네임"
              className="flex-1"
              error={profileForm.formState.errors.nickname?.message}
              errorId="settings-nickname-error"
            >
              <Input
                id="settings-nickname"
                aria-invalid={Boolean(profileForm.formState.errors.nickname)}
                aria-describedby={
                  profileForm.formState.errors.nickname
                    ? "settings-nickname-error"
                    : undefined
                }
                {...profileForm.register("nickname")}
              />
            </FieldGroup>
            <Button
              type="submit"
              size="sm"
              className="mt-6"
              disabled={profileForm.formState.isSubmitting}
            >
              저장
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle as="h2">관심 업무 도메인</CardTitle>
          <CardDescription>
            선택한 도메인 가이드를 홈 화면 상단에 우선 배치합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ToggleGroup
            type="multiple"
            value={interests}
            onValueChange={setInterests}
          >
            {WORK_DOMAINS.map((d) => (
              <ToggleGroupItem key={d.slug} value={d.slug}>
                {d.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <div>
            <Button size="sm" onClick={handleSaveInterests}>
              관심 도메인 저장
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle as="h2">화면 테마</CardTitle>
        </CardHeader>
        <CardContent>
          <ToggleGroup
            type="single"
            value={theme === "dark" ? "dark" : "light"}
            onValueChange={(v) => v && setTheme(v)}
          >
            <ToggleGroupItem value="light">라이트</ToggleGroupItem>
            <ToggleGroupItem value="dark">다크</ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle as="h2">비밀번호 변경</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            noValidate
            onSubmit={passwordForm.handleSubmit(handleChangePassword)}
            className="flex flex-col gap-3"
          >
            <FieldGroup
              htmlFor="cur-pw"
              label="현재 비밀번호"
              required
              error={passwordForm.formState.errors.currentPassword?.message}
              errorId="cur-pw-error"
            >
              <Input
                id="cur-pw"
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(
                  passwordForm.formState.errors.currentPassword,
                )}
                aria-describedby={
                  passwordForm.formState.errors.currentPassword
                    ? "cur-pw-error"
                    : undefined
                }
                {...passwordForm.register("currentPassword")}
              />
            </FieldGroup>
            <FieldGroup
              htmlFor="new-pw"
              label="새 비밀번호"
              required
              hint="8자 이상 입력해 주세요."
              error={passwordForm.formState.errors.newPassword?.message}
              errorId="new-pw-error"
            >
              <Input
                id="new-pw"
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(passwordForm.formState.errors.newPassword)}
                aria-describedby={
                  passwordForm.formState.errors.newPassword
                    ? "new-pw-error"
                    : undefined
                }
                {...passwordForm.register("newPassword")}
              />
            </FieldGroup>
            <div>
              <Button
                type="submit"
                size="sm"
                disabled={passwordForm.formState.isSubmitting}
              >
                비밀번호 변경
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border border-status-expired-border">
        <CardHeader>
          <CardTitle as="h2" className="text-status-expired-fg">
            회원 탈퇴
          </CardTitle>
          <CardDescription>
            탈퇴 시 개인 지식 보관함 및 모든 개인정보가 즉시 영구 삭제됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteOpen(true)}
          >
            회원 탈퇴
          </Button>
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>정말 탈퇴하시겠습니까?</DialogTitle>
            <DialogDescription>
              보관함 폴더·태그·북마크·외부 URL 데이터가 모두 영구 삭제되며 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteOpen(false)}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={deleteMutation.isPending}
              onClick={handleConfirmDelete}
            >
              {deleteMutation.isPending ? "처리 중..." : "영구 탈퇴 확인"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
