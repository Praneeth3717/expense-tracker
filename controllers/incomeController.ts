import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} from "@/services/transactionService";

import { TransactionPayload } from "@/types/transaction";

export const AddIncome = (data: TransactionPayload) =>
  addTransaction({ ...data, type: "income" });

export const getIncome = (userId: number) => 
  getTransactions(userId, "income");

export const deleteIncome = deleteTransaction;

export const updateIncome = updateTransaction;
