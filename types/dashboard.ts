export interface Transaction {
  _id: string;
  category: string;
  date: Date;
  type: string;
  amount: number;
}

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
