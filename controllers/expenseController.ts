import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} from "@/services/transactionService";

import { TransactionPayload } from "@/types/transaction";

export const AddExpense = (data: TransactionPayload) =>
  addTransaction({ ...data, type: "expense" });

export const getExpenses = (userId: number) =>
  getTransactions(userId, "expense");

export const deleteExpense = deleteTransaction;

export const updateExpense = updateTransaction;
