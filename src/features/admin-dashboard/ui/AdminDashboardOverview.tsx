"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Flag,
  Inbox,
  Rss,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, ErrorState } from "@/shared/ui";
import { useAdminDashboardQuery } from "../model/useAdminDashboard";

export const AdminDashboardOverview = () => {
  const query = useAdminDashboardQuery();

  if (query.isError) {
    return (
      <ErrorState
        title="대시보드 지표를 불러오지 못했습니다."
        description="잠시 후 다시 시도해 주세요."
      />
    );
  }

  const stats = query.data?.data ?? {
    pendingInboxCount: 0,
    staleContentCount: 0,
    openReportCount: 0,
    failedJobs24hCount: 0,
  };

  const cards = [
    {
      label: "검수 대기열",
      value: stats.pendingInboxCount,
      href: "/admin/inbox",
      icon: Inbox,
      description: "AI 초안 검수 대기 항목",
    },
    {
      label: "재확인 필요·만료",
      value: stats.staleContentCount,
      href: "/admin/contents",
      icon: CheckCircle2,
      description: "유효성 점검 대상 콘텐츠",
    },
    {
      label: "미처리 오류 제보",
      value: stats.openReportCount,
      href: "/admin/reports",
      icon: Flag,
      description: "사용자 제보 확인 필요",
    },
    {
      label: "24시간 수집·작업 실패",
      value: stats.failedJobs24hCount,
      href: "/admin/sources",
      icon: AlertTriangle,
      description: "소스 수집 및 배치 상태",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </CardTitle>
                  <Icon
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums">
                    {query.isLoading ? "—" : card.value}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Rss className="h-4 w-4" aria-hidden="true" />
            빠른 운영 작업
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 text-sm">
          <Link href="/admin/inbox" className="text-primary hover:underline">
            수집함 검수하기 →
          </Link>
          <Link href="/admin/reports" className="text-primary hover:underline">
            오류 제보 처리하기 →
          </Link>
          <Link href="/admin/contents" className="text-primary hover:underline">
            유효성 일괄 점검 →
          </Link>
          <Link href="/admin/sources" className="text-primary hover:underline">
            소스 즉시 수집 →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
