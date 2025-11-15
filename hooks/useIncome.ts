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

interface RecentIncomeData {
  date: string;
  amount: number;
}

export interface IncomeResponse {
  IncomeList: Transaction[];
  IncomeData: RecentIncomeData[];
}

export const useIncome = (userId?: string) => {
  const queryClient = useQueryClient();

  // GET Income Dashboard
  const incomeQuery = useQuery<IncomeResponse>({
    queryKey: ["income-dashboard", userId],
    queryFn: async () => {
      const res = await api.get(`/income?userId=${userId}`);
      return res.data.data;
    },
    enabled: !!userId, // only run when userId available
  });

  // ADD Income
  const addIncome = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/income", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-dashboard", userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });

  // UPDATE Income
  const updateIncome = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.patch(`/income?id=${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-dashboard", userId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
    },
  });

  // DELETE Income
  const deleteIncome = useMutation({
    mutationFn: async (id: string) => {
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
