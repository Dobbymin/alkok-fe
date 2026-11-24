import { AdminDashboardOverview } from "@/features/admin-dashboard";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">운영 대시보드</h1>
        <p className="text-sm text-muted-foreground">
          검수 대기열·유효성 점검·오류 제보·수집 작업 현황을 한눈에 확인합니다.
        </p>
      </header>
      <AdminDashboardOverview />
    </div>
  );
}
