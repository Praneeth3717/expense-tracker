"use client";

import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { DashboardData } from "@/types/dashboard";

interface ApiResponse {
  success: boolean;
  data: DashboardData;
}

export default function useDashboard(userId?: number) {
  return useQuery<DashboardData>({
    queryKey: ["dashboard", userId],
    queryFn: async () => {
      const res = await api.get<ApiResponse>(`/dashboard?userId=${userId}`);
      return res.data.data;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });
}
