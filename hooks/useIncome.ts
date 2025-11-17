"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  IncomeDashboardData,
  IncomePayload,
  IncomeTransaction,
} from "@/types/income";

interface ApiResponse {
  success: boolean;
  data: IncomeDashboardData;
}

export const useIncome = (userId?: string) => {
  const queryClient = useQueryClient();

  const incomeQuery = useQuery<IncomeDashboardData>({
    queryKey: ["income-dashboard", userId],
    queryFn: async () => {
      const res = await api.get<ApiResponse>(`/income?userId=${userId}`);
      return res.data.data;
    },
    enabled: !!userId,
  });

  // ADD
  const addIncome = useMutation<IncomeTransaction, Error, IncomePayload>({
    mutationFn: async (payload) => {
      const res = await api.post("/income", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-dashboard", userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });

  // UPDATE
  const updateIncome = useMutation<
    IncomeTransaction,
    Error,
    { id: string; data: IncomePayload }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch(`/income?id=${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-dashboard", userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });

  // DELETE
  const deleteIncome = useMutation<unknown, Error, string>({
    mutationFn: async (id) => {
      const res = await api.delete(`/income?id=${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-dashboard", userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });

  return {
    incomeQuery,
    addIncome,
    updateIncome,
    deleteIncome,
  };
};
