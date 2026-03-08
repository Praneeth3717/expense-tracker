"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { IncomeDashboardData } from "@/types/dashboard";
import { Transaction, TransactionPayload } from "@/types/transaction";

interface ApiResponse {
  success: boolean;
  data: IncomeDashboardData;
}

export const useIncome = (userId?: number) => {
  const queryClient = useQueryClient();

  const incomeQuery = useQuery<IncomeDashboardData>({
    queryKey: ["income-dashboard", userId],
    queryFn: async () => {
      if (!userId) throw new Error("UserId missing");
      const res = await api.get<ApiResponse>(`/income?userId=${userId}`);
      return res.data.data;
    },
    enabled: !!userId,
  });

  const addIncome = useMutation<Transaction, Error, TransactionPayload>({
    mutationFn: async (payload) => {
      const res = await api.post<{ success: boolean; data: Transaction }>(
        "/income",
        payload
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-dashboard", userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });

  const updateIncome = useMutation<
    Transaction,
    Error,
    { id: number; data: TransactionPayload }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch<{ success: boolean; data: Transaction }>(
        `/income?id=${id}`,
        data
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-dashboard", userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });

  const deleteIncome = useMutation<{ id: number }, Error, number>({
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