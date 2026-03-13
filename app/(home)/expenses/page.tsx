"use client";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoIosAdd } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import TransactionModal from "@/components/common/TransactionModal";
import Loader from "@/components/common/Loader";
import Chart4 from "@/components/charts/Chart4";
import { useSession } from "next-auth/react";
import { useTransactions } from "@/hooks/useTransactions";
import { Transaction } from "@/types/transaction";
import { formatDate } from "@/utils/formatDate";

const Expenses = () => {
  const [showAddExpensesModal, setShowAddExpensesModal] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Transaction | null>(null);

  const handleEditClick = (trans: Transaction) => {
    setEditData(trans);
    setShowAddExpensesModal(true);
  };

  const { data: session, status } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : undefined;

  const {
    transactionQuery: expenseQuery,
    addTransaction: addExpense,
    updateTransaction: updateExpense,
    deleteTransaction: deleteExpense,
  } = useTransactions("expense", userId);

  if (status === "loading" || expenseQuery.isLoading) {
    return <Loader />;
  }

  if (expenseQuery.isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-sm">
          Failed to fetch expense data. Try again.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="p-2 md:p-4 bg-gray-100 min-h-[calc(100vh-3rem)] overflow-y-auto">
        <div className="space-y-3 md:space-y-4">
          <div className="rounded-lg bg-white p-3 md:p-4 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
              <div>
                <h1 className="text-lg md:text-xl text-gray-800">
                  Expenses Overview
                </h1>
                <p className="text-xs text-gray-500">
                  Track your spending and analyze expense trends
                </p>
              </div>

              <button
                onClick={() => setShowAddExpensesModal(true)}
                className="mt-2 md:mt-0 px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full md:w-auto flex items-center justify-center gap-1"
              >
                <IoIosAdd className="text-xl" />
                Add Expense
              </button>
            </div>

            <div className="rounded-lg p-2 md:p-4 text-gray-600 text-center">
              <Chart4 expenseData={expenseQuery.data?.chartData ?? []} />
            </div>
          </div>

          <div className="rounded-lg bg-white p-3 md:p-4 shadow-sm">
            <div className="mb-3">
              <h1 className="text-lg md:text-xl text-gray-800">All Expenses</h1>
            </div>

            {expenseQuery.data?.list?.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-10">
                No expenses recorded yet. Start by adding your first expense!
              </p>
            ) : (
              <ul className="space-y-2 grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-x-6">
                {expenseQuery.data?.list?.map((trans) => (
                  <li
                    key={trans.id}
                    onMouseEnter={() => setHoveredItemId(trans.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    className="flex justify-between items-center p-1.5 md:p-2 hover:bg-gray-200 rounded-md"
                  >
                    <div className="flex items-center gap-1.5 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 text-base md:text-lg bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {trans.category.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h2 className="text-xs md:text-sm text-gray-800 font-medium">
                          {trans.category}
                        </h2>

                        <p className="text-xs text-gray-500">
                          {formatDate(trans.transactionDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1.5 md:gap-3 items-center">
                      <div
                        className={`flex gap-1.5 md:gap-2 ${
                          hoveredItemId === trans.id
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        <FiEdit
                          onClick={() => handleEditClick(trans)}
                          className="text-lg text-gray-400 cursor-pointer"
                        />

                        <AiOutlineDelete
                          onClick={() => deleteExpense.mutate(trans.id)}
                          className="text-xl text-gray-400 cursor-pointer"
                        />
                      </div>

                      <div className="font-bold text-xs md:text-sm text-orange-600 min-w-[70px] text-right">
                        -₹{trans.amount}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {showAddExpensesModal && (
        <div className="w-screen fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50 z-40"></div>

          <div className="relative z-50 w-full max-w-xs md:max-w-xl px-2 md:px-3">
            <TransactionModal
              type="expense"
              onClose={() => {
                setShowAddExpensesModal(false);
                setEditData(null);
              }}
              editData={editData}
              setEditData={setEditData}
              User_Id={userId}
              addExpense={addExpense}
              updateExpense={updateExpense}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Expenses;
