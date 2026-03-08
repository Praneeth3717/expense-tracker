import pool from "@/lib/mysql";
import { Transaction, TransactionType, TransactionPayload } from "@/types/transaction";
import { DateChartData } from "@/types/dashboard";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface TransactionRow extends Transaction, RowDataPacket {}
interface ChartRow extends DateChartData, RowDataPacket {}

export const addTransaction = async (
  category: string,
  amount: number,
  transactionDate: string,
  userId: number,
  type: TransactionType,
): Promise<Transaction> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO transactions (category, amount, transaction_date, type, user_id)
     VALUES (?, ?, ?, ?, ?)`,
    [category, amount, transactionDate, type, userId],
  );

  const [[transaction]] = await pool.query<TransactionRow[]>(
    `SELECT id,user_id AS userId,type,category,amount,transaction_date AS transactionDate
     FROM transactions
     WHERE id = ?`,
    [result.insertId],
  );

  return transaction;
};

export const getTransactions = async (
  userId: number,
  type: TransactionType,
) => {
  const [[list], [chartData]] = await Promise.all([
    pool.query<TransactionRow[]>(
      `SELECT id,user_id AS userId,type,category,amount,transaction_date AS transactionDate
       FROM transactions
       WHERE user_id = ? AND type = ?
       ORDER BY transaction_date DESC`,
      [userId, type],
    ),

    pool.query<ChartRow[]>(
      `SELECT 
        DATE(transaction_date) AS transactionDate,
        SUM(amount) AS amount
       FROM transactions
       WHERE user_id = ? AND type = ?
       GROUP BY transactionDate
       ORDER BY transactionDate DESC
       LIMIT 10`,
      [userId, type],
    ),
  ]);

  return {
    list,
    chartData: chartData.reverse(),
  };
};

export const deleteTransaction = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM transactions WHERE id = ?`,
    [id],
  );

  if (result.affectedRows === 0) {
    throw new Error("Transaction not found");
  }

  return { id };
};

export const updateTransaction = async (
  id: number,
  updateData: Partial<TransactionPayload>,
): Promise<Transaction> => {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (updateData.category !== undefined) {
    fields.push("category = ?");
    values.push(updateData.category);
  }

  if (updateData.amount !== undefined) {
    fields.push("amount = ?");
    values.push(updateData.amount);
  }

  if (updateData.transactionDate !== undefined) {
    fields.push("transaction_date = ?");
    values.push(updateData.transactionDate);
  }

  if (fields.length === 0) {
    throw new Error("No fields provided for update");
  }

  values.push(id);

  await pool.query(
    `UPDATE transactions SET ${fields.join(", ")} WHERE id = ?`,
    values,
  );

  const [[updatedTransaction]] = await pool.query<TransactionRow[]>(
    `SELECT id,user_id AS userId,type,category,amount,transaction_date AS transactionDate
     FROM transactions
     WHERE id = ?`,
    [id],
  );

  return updatedTransaction;
};
