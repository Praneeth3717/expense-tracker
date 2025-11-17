import { Transaction } from "./transaction";

export interface IncomeTransaction extends Transaction {
  type: "income";
}

export interface IncomeDashboardData {
  IncomeList: IncomeTransaction[];
  IncomeData: {
    date: string;
    amount: number;
  }[];
}

export interface IncomePayload {
  category: string;
  amount: number;
  date: string;
  userId: string;
}