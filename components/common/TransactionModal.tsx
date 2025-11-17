"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { UseMutationResult } from "@tanstack/react-query";
import { Transaction } from "@/types/transaction";
import { IncomeTransaction, IncomePayload } from "@/types/income";
import { ExpenseTransaction, ExpensePayload } from "@/types/expense";

interface FormData {
  category: string;
  amount: string;
  date: string;
}

interface TransactionModalProps {
  type: "income" | "expense";
  onClose: () => void;
  editData: Transaction | null;
  setEditData: (data: Transaction | null) => void;
  User_Id?: string;

  addIncome?: UseMutationResult<IncomeTransaction, Error, IncomePayload>;
  updateIncome?: UseMutationResult<
    IncomeTransaction,
    Error,
    { id: string; data: IncomePayload }
  >;
  addExpense?: UseMutationResult<ExpenseTransaction, Error, ExpensePayload>;
  updateExpense?: UseMutationResult<
    ExpenseTransaction,
    Error,
    { id: string; data: ExpensePayload }
  >;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  type,
  onClose,
  editData,
  setEditData,
  User_Id,
  addIncome,
  updateIncome,
  addExpense,
  updateExpense,
}) => {
  const [formData, setFormData] = useState<FormData>({
    category: "",
    amount: "",
    date: "",
  });

  const HandleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!User_Id) {
      console.error("User ID is missing");
      return;
    }

    const FinalData: IncomePayload = {
      category: formData.category,
      amount: Number(formData.amount),
      date: formData.date,
      userId: User_Id,
    };

    // UPDATE
    if (editData) {
      if (type === "income") {
        updateIncome?.mutate(
          { id: editData._id, data: FinalData },
          {
            onSuccess: () => {
              console.log("Income updated");
              setEditData(null);
              onClose();
            },
          }
        );
      } else {
        updateExpense?.mutate(
          { id: editData._id, data: FinalData },
          {
            onSuccess: () => {
              console.log("Expense updated");
              setEditData(null);
              onClose();
            },
          }
        );
      }
      return;
    }

    // ADD
    if (type === "income") {
      addIncome?.mutate(FinalData, {
        onSuccess: () => {
          console.log("Income added");
          onClose();
        },
      });
    } else {
      addExpense?.mutate(FinalData, {
        onSuccess: () => {
          console.log("Expense added");
          onClose();
        },
      });
    }
  };
  useEffect(() => {
    if (editData) {
      setFormData({
        category: editData.category,
        amount: String(editData.amount),
        date: editData.date.split("T")[0],
      });
    }
  }, [editData]);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold text-gray-800">
          {editData
            ? `Update ${type === "income" ? "Income" : "Expense"}`
            : `Add ${type === "income" ? "Income" : "Expense"}`}
        </h1>
        <RxCross2
          onClick={() => {
            onClose();
            setEditData(null);
          }}
          className="text-gray-600 cursor-pointer"
        />
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        {/* CATEGORY */}
        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-700 font-medium">
            {type === "income" ? "Income Source" : "Expense Category"}
          </label>
          <input
            name="category"
            value={formData.category}
            onChange={HandleChange}
            placeholder={
              type === "income"
                ? "Freelance, Salary, etc."
                : "Groceries, Rent, etc."
            }
            className="p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-500"
            required
          />
        </div>

        {/* AMOUNT */}
        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-700 font-medium">
            Amount
          </label>
          <input
            name="amount"
            type="number"
            value={formData.amount}
            placeholder="Enter Amount"
            onChange={HandleChange}
            className="p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-500"
            required
          />
        </div>

        {/* DATE */}
        <div className="flex flex-col">
          <label className="mb-1 text-xs text-gray-700 font-medium">Date</label>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={HandleChange}
            className="p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-500"
            required
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {editData ? "Update" : "Add"}{" "}
            {type === "income" ? "Income" : "Expense"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionModal;
