import { AdminReportsManager } from "@/features/admin-reports";

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">오류 제보 관리</h1>
        <p className="text-sm text-muted-foreground">
          사용자가 접수한 요금·링크·정보 오류 제보를 확인하고 처리 상태를 변경합니다.
        </p>
      </header>
      <AdminReportsManager />
    </div>
  );
}
