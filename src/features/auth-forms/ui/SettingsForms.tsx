"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { WORK_DOMAINS } from "@/entities/taxonomy";
import { useAuth } from "@/shared/auth";
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
} from "@/shared/ui";
import { authApi } from "../api/auth.api";
import { useDeleteAccountMutation } from "../model/useAuthMutations";

export const SettingsForms = () => {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [interests, setInterests] = useState<string[]>(
    user?.interestCategorySlugs ?? [],
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteMutation = useDeleteAccountMutation();

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await authApi.updateProfile(nickname.trim());
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

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await authApi.updatePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
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
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>프로필 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="flex items-end gap-3">
            <FieldGroup htmlFor="settings-nickname" label="닉네임" className="flex-1">
              <Input
                id="settings-nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </FieldGroup>
            <Button type="submit" size="sm">
              저장
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>관심 업무 도메인</CardTitle>
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
          <CardTitle>화면 테마</CardTitle>
        </CardHeader>
        <CardContent>
          <ToggleGroup
            type="single"
            value={theme ?? "system"}
            onValueChange={(v) => v && setTheme(v)}
          >
            <ToggleGroupItem value="system">시스템</ToggleGroupItem>
            <ToggleGroupItem value="light">라이트</ToggleGroupItem>
            <ToggleGroupItem value="dark">다크</ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>비밀번호 변경</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
            <FieldGroup htmlFor="cur-pw" label="현재 비밀번호" required>
              <Input
                id="cur-pw"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </FieldGroup>
            <FieldGroup htmlFor="new-pw" label="새 비밀번호" required>
              <Input
                id="new-pw"
                type="password"
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </FieldGroup>
            <div>
              <Button type="submit" size="sm">
                비밀번호 변경
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-status-expired-border">
        <CardHeader>
          <CardTitle className="text-status-expired-fg">회원 탈퇴</CardTitle>
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
              variant="outline"
              size="sm"
              onClick={() => setDeleteOpen(false)}
            >
              취소
            </Button>
            <Button
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
