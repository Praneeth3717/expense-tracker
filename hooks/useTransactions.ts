"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import {
  IncomeDashboardData,
  ExpenseDashboardData,
} from "@/types/dashboard";
import {
  Transaction,
  TransactionPayload,
  TransactionType,
} from "@/types/transaction";

type DashboardData = IncomeDashboardData | ExpenseDashboardData;

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface UpdatePayload {
  id: number;
  data: Partial<TransactionPayload>;
}

export const useTransactions = (
  type: TransactionType,
  userId?: number
) => {
  const queryClient = useQueryClient();
  const endpoint = `/${type}`;
  const queryKey = queryKeys.transactions(type, userId);

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({
      queryKey: queryKeys.dashboard(userId),
    });
  };

  const transactionQuery = useQuery<DashboardData>({
    queryKey,
    queryFn: async () => {
      if (!userId) throw new Error("UserId missing");

      const res = await api.get<ApiResponse<DashboardData>>(
        `${endpoint}?userId=${userId}`
      );

      return res.data.data;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  const addTransaction = useMutation<Transaction, Error, TransactionPayload>({
    mutationFn: async (payload) => {
      const res = await api.post<ApiResponse<Transaction>>(endpoint, payload);
      return res.data.data;
    },
    onSuccess: invalidateAll,
  });

  const updateTransaction = useMutation<Transaction, Error, UpdatePayload>({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch<ApiResponse<Transaction>>(
        `${endpoint}?id=${id}`,
        data
      );

      return res.data.data;
    },
    onSuccess: invalidateAll,
  });

  const deleteTransaction = useMutation<{ id: number }, Error, number>({
    mutationFn: async (id) => {
      const res = await api.delete<ApiResponse<{ id: number }>>(
        `${endpoint}?id=${id}`
      );
      return res.data.data;
    },
    onSuccess: invalidateAll,
  });

  return {
    transactionQuery,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};