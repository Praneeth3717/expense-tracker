import { Transaction } from "@/types/transaction";
import pool from "@/lib/mysql";
import { RowDataPacket } from "mysql2";

interface DashboardData {
  recentTransactions: Transaction[];
  recentExpenses: Transaction[];
  recentIncome: Transaction[];
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  expenseData: {
    category: string;
    amount: number;
  }[];
  incomeData: {
    category: string;
    amount: number;
  }[];
}

interface TransactionRow extends Transaction, RowDataPacket {}

interface TotalRow extends RowDataPacket {
  type: "income" | "expense";
  totalAmount: number;
}

interface CategoryRow extends RowDataPacket {
  category: string;
  amount: number;
}

export const getDashboardData = async (
  userId: number
): Promise<DashboardData> => {
  try {
    const [
      [recentTransactions],
      [recentExpenses],
      [recentIncome],
      [totals],
      [expenseRows],
      [incomeRows],
    ] = await Promise.all([
      pool.query<TransactionRow[]>(
        `SELECT id,user_id AS userId,type,category,amount,transaction_date AS transactionDate
         FROM transactions
         WHERE user_id = ?
         ORDER BY transaction_date DESC
         LIMIT 5`,
        [userId]
      ),

      pool.query<TransactionRow[]>(
        `SELECT id,user_id AS userId,type,category,amount,transaction_date AS transactionDate
         FROM transactions
         WHERE user_id = ? AND type='expense'
         ORDER BY transaction_date DESC
         LIMIT 5`,
        [userId]
      ),

      pool.query<TransactionRow[]>(
        `SELECT id,user_id AS userId,type,category,amount,transaction_date AS transactionDate
         FROM transactions
         WHERE user_id = ? AND type='income'
         ORDER BY transaction_date DESC
         LIMIT 5`,
        [userId]
      ),

      pool.query<TotalRow[]>(
        `SELECT type, SUM(amount) AS totalAmount
         FROM transactions
         WHERE user_id = ?
         GROUP BY type`,
        [userId]
      ),

      pool.query<CategoryRow[]>(
        `SELECT 
            CASE 
              WHEN amount < 100 THEN 'Others'
              ELSE category
            END AS category,
            SUM(amount) AS amount
         FROM transactions
         WHERE user_id = ? AND type='expense'
         GROUP BY 
            CASE 
              WHEN amount < 100 THEN 'Others'
              ELSE category
            END`,
        [userId]
      ),

      pool.query<CategoryRow[]>(
        `SELECT category, SUM(amount) AS amount
         FROM transactions
         WHERE user_id = ? AND type='income'
         GROUP BY category`,
        [userId]
      ),
    ]);

    const summary = totals.reduce(
      (acc, curr) => {
        acc[curr.type] = curr.totalAmount;
        return acc;
      },
      { income: 0, expense: 0 }
    );

    return {
      recentTransactions,
      recentExpenses,
      recentIncome,
      totalIncome: summary.income,
      totalExpense: summary.expense,
      totalBalance: summary.income - summary.expense,
      expenseData: expenseRows,
      incomeData: incomeRows,
    };
  } catch (error) {
    console.error("Dashboard Service Error:", error);
    throw new Error("Could not load dashboard. Please try again later.");
  }
};