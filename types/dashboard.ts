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

// import { Transaction } from "./transaction";

// export interface RecentData {
//   date: string;    // "2024-01-01"
//   amount: number;
// }

// export interface CategoryData {
//   category: string;
//   amount: number;
// }

// export interface DashboardData {
//   recentTransactions: Transaction[];

//   // Income data
//   recentIncome: RecentData[];
//   incomeData: CategoryData[];

//   // Expense data
//   recentExpenses: RecentData[];
//   expenseData: CategoryData[];

//   totalIncome: number;
//   totalExpense: number;
//   totalBalance: number;
// }
