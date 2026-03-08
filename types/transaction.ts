export type TransactionType = "income" | "expense";

export interface Transaction {
  id: number;
  userId: number;
  type: TransactionType;
  category: string;
  amount: number;
  transactionDate: string;
}

export interface TransactionPayload {
  category: string;
  amount: number;
  transactionDate: string;
  userId: number;
}