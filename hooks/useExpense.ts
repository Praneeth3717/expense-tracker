"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ExpenseDashboardData } from "@/types/dashboard";
import { Transaction, TransactionPayload } from "@/types/transaction";

interface ApiResponse {
  success: boolean;
  data: ExpenseDashboardData;
}

export const useExpense = (userId?: number) => {
  const queryClient = useQueryClient();

  const expenseQuery = useQuery<ExpenseDashboardData>({
    queryKey: ["expense-dashboard", userId],
    queryFn: async () => {
      if (!userId) throw new Error("UserId missing");
      const res = await api.get<ApiResponse>(`/expense?userId=${userId}`);
      return res.data.data;
    },
    enabled: !!userId,
  });

  const addExpense = useMutation<Transaction, Error, TransactionPayload>({
    mutationFn: async (payload) => {
      const res = await api.post<{
        success: boolean;
        data: Transaction;
      }>("/expense", payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expense-dashboard", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });

  const updateExpense = useMutation<
    Transaction,
    Error,
    { id: number; data: Partial<TransactionPayload> }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch<{
        success: boolean;
        data: Transaction;
      }>(`/expense?id=${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expense-dashboard", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });

  const deleteExpense = useMutation<unknown, Error, number>({
    mutationFn: async (id) => {
      const res = await api.delete(`/expense?id=${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expense-dashboard", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });

  return {
    expenseQuery,
    addExpense,
    updateExpense,
    deleteExpense,
  };
};
