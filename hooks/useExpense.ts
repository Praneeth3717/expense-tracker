"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

interface Transaction {
  _id: string;
  type: string;
  category: string;
  amount: number;
  date: string;
}

interface RecentExpenseData {
  date: string;
  amount: number;
}

export interface ExpenseResponse {
  ExpensesList: Transaction[];
  ExpenseData: RecentExpenseData[];
}

export const useExpense = (userId?: string) => {
  const queryClient = useQueryClient();

  // GET Expense Dashboard
  const expenseQuery = useQuery<ExpenseResponse>({
    queryKey: ["expense-dashboard", userId],
    queryFn: async () => {
      const res = await api.get(`/expense?userId=${userId}`);
      return res.data.data;
    },
    enabled: !!userId,
  });

  // ADD Expense
  const addExpense = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/expense", data);
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
  const updateExpense = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
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
  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
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
