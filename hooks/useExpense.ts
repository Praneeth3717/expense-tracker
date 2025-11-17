"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  ExpenseDashboardData,
  ExpenseTransaction,
  ExpensePayload,
} from "@/types/expense";

interface ApiResponse {
  success: boolean;
  data: ExpenseDashboardData;
}

export const useExpense = (userId?: string) => {
  const queryClient = useQueryClient();

  // GET Expense Dashboard
  const expenseQuery = useQuery<ExpenseDashboardData>({
    queryKey: ["expense-dashboard", userId],
    queryFn: async () => {
      const res = await api.get<ApiResponse>(`/expense?userId=${userId}`);
      return res.data.data;
    },
    enabled: !!userId,
  });

  // ADD Expense
  const addExpense = useMutation<ExpenseTransaction, Error, ExpensePayload>({
    mutationFn: async (payload) => {
      const res = await api.post("/expense", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expense-dashboard", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });

  // UPDATE Expense
  const updateExpense = useMutation<
    ExpenseTransaction,
    Error,
    { id: string; data: ExpensePayload }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch(`/expense?id=${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expense-dashboard", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });

  // DELETE Expense
  const deleteExpense = useMutation<unknown, Error, string>({
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
