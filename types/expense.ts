import { Transaction } from "./transaction";

export interface ExpenseTransaction extends Transaction {
  type: "expense";
}

export interface ExpenseDashboardData {
  ExpenseList: ExpenseTransaction[];
  ExpenseData: {
    date: string;
    amount: number;
  }[];
}

export interface ExpensePayload {
  category: string;
  amount: number;
  date: string;
  userId: string;
}
