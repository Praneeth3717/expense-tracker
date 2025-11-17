"use client";

import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { DashboardData } from "@/types/dashboard";

interface ApiResponse {
  success: boolean;
  data: DashboardData;
}

export default function useDashboard(userId?: string) {
  return useQuery<DashboardData>({
    queryKey: ["dashboard", userId],
    queryFn: async () => {
      const res = await api.get<ApiResponse>(`/transactions?userId=${userId}`);
      return res.data.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
