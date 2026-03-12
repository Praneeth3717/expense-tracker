import pool from "@/lib/mysql";
import { RowDataPacket } from "mysql2";
import { Transaction } from "@/types/transaction";
import { DashboardData, CategoryChartData } from "@/types/dashboard";

interface TransactionRow extends Transaction, RowDataPacket {}
interface CategoryRow extends CategoryChartData, RowDataPacket {}
interface TotalRow extends RowDataPacket {
  totalIncome: number;
  totalExpense: number;
}

export const getDashboardData = async (
  userId: number,
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
        [userId],
      ),

      pool.query<TransactionRow[]>(
        `SELECT id,user_id AS userId,type,category,amount,transaction_date AS transactionDate
         FROM transactions
         WHERE user_id = ? AND type='expense'
         ORDER BY transaction_date DESC
         LIMIT 5`,
        [userId],
      ),

      pool.query<TransactionRow[]>(
        `SELECT id,user_id AS userId,type,category,amount,transaction_date AS transactionDate
         FROM transactions
         WHERE user_id = ? AND type='income'
         ORDER BY transaction_date DESC
         LIMIT 5`,
        [userId],
      ),

      pool.query<TotalRow[]>(
        `SELECT
          COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE 0 END), 0) AS totalIncome,
          COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END), 0) AS totalExpense
        FROM transactions
        WHERE user_id = ?`,
        [userId],
      ),

      pool.query<CategoryRow[]>(
        `SELECT 
          CASE 
            WHEN amount < 100 THEN 'Others'
            ELSE category
          END AS category,
          SUM(amount) AS amount
        FROM (
          SELECT category, SUM(amount) AS amount
          FROM transactions
          WHERE user_id = ? AND type='expense'
          GROUP BY category
        ) t
        GROUP BY
          CASE 
            WHEN amount < 100 THEN 'Others'
            ELSE category
          END`,
        [userId],
      ),

      pool.query<CategoryRow[]>(
        `SELECT category, SUM(amount) AS amount
         FROM transactions
         WHERE user_id = ? AND type='income'
         GROUP BY category`,
        [userId],
      ),
    ]);

    const { totalIncome, totalExpense } = totals[0] || {
      totalIncome: 0,
      totalExpense: 0,
    };

    return {
      recentTransactions,
      recentExpenses,
      recentIncome,
      totalIncome: totalIncome,
      totalExpense: totalExpense,
      totalBalance: totalIncome - totalExpense,
      expenseData: expenseRows,
      incomeData: incomeRows,
    };
  } catch (error) {
    console.error("Dashboard Service Error:", error);
    throw new Error("Could not load dashboard. Please try again later.");
  }
};
