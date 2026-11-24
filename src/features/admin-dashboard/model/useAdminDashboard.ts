"use client";

import { useQuery } from "@tanstack/react-query";
import { ADMIN_QUERY_KEYS } from "@/shared/api";
import { adminDashboardApi } from "../api/admin-dashboard.api";

export const useAdminDashboardQuery = () =>
  useQuery({
    queryKey: ADMIN_QUERY_KEYS.dashboard(),
    queryFn: () => adminDashboardApi.getSummary(),
  });
