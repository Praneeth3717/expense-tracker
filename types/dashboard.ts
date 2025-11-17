import { Transaction } from "./transaction";

export type FetchedData = {
  category: string;
  amount: number;
};

export interface DashboardData {
  recentTransactions: Transaction[];
  recentIncome: Transaction[];
  recentExpenses: Transaction[];
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  expenseData: FetchedData[];
  incomeData: FetchedData[];
}