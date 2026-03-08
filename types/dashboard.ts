import { Transaction, TransactionType } from "./transaction";

export type CategoryChartData = {
  category: string;
  amount: number;
};

export type DateChartData = {
  transactionDate: string;
  amount: number;
};

export interface DashboardData {
  recentTransactions: Transaction[];
  recentIncome: Transaction[];
  recentExpenses: Transaction[];
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  expenseData: CategoryChartData[];
  incomeData: CategoryChartData[];
}

interface TransactionDashboardData<T extends TransactionType> {
  list: (Transaction & { type: T })[];
  chartData: DateChartData[];
}

export type IncomeDashboardData = TransactionDashboardData<"income">;
export type ExpenseDashboardData = TransactionDashboardData<"expense">;