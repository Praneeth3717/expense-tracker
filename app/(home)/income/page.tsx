"use client";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosAdd } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import TransactionModal from "@/components/common/TransactionModal";
import Loader from "@/components/common/Loader";
import Chart5 from "@/components/charts/Chart5";
import { useSession } from "next-auth/react";
import { useIncome } from "@/hooks/useIncome";
import { Transaction } from "@/types/transaction";

const Income = () => {
  const { data: session } = useSession();
  const {
    incomeQuery: IncomeDashboardData,
    deleteIncome,
    addIncome,
    updateIncome,
  } = useIncome(session?.user?.id);

  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Transaction | null>(null);

  const handleEditClick = (trans: Transaction) => {
    setEditData(trans);
    setShowAddIncomeModal(true);
  };

  if (IncomeDashboardData.isLoading) {
    return <Loader />;
  }

  if (IncomeDashboardData.isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-sm">
          Failed to fetch income data. Try again.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="p-2 md:p-4 bg-gray-100 min-h-[calc(100vh-3rem)] overflow-y-auto">
        <div className="space-y-3 md:space-y-4">
          {/* Income Overview Card */}
          <div className="rounded-lg bg-white p-3 md:p-4 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
              <div>
                <h1 className="text-lg md:text-xl text-gray-800">
                  Income Overview
                </h1>
                <p className="text-xs text-gray-500">
                  Track your earnings over time and analyze your income trends
                </p>
              </div>
              <button
                onClick={() => setShowAddIncomeModal(true)}
                className="mt-2 md:mt-0 px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full md:w-auto flex items-center justify-center gap-1"
              >
                <IoIosAdd className="text-xl" />
                Add Income
              </button>
            </div>

            <div className="rounded-lg p-2 md:p-4 text-gray-600 text-center">
              <Chart5 IncomeData={IncomeDashboardData.data?.IncomeData || []} />
            </div>
          </div>

          <div className="rounded-lg bg-white p-3 md:p-4 shadow-sm">
            <div className="mb-3">
              <h1 className="text-lg md:text-xl text-gray-800">
                Income Sources
              </h1>
            </div>
            <div className="rounded-lg p-2 md:p-4 text-gray-600">
              <ul className="space-y-2 grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-x-6">
                {IncomeDashboardData.data?.IncomeList.map((trans) => {
                  return (
                    <li
                      key={trans._id}
                      onMouseEnter={() => setHoveredItemId(trans._id)}
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
                            {new Date(trans.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 md:gap-3 items-center">
                        <div
                          className={`flex gap-1.5 md:gap-2 ${
                            hoveredItemId === trans._id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        >
                          <FiEdit
                            onClick={() => handleEditClick(trans)}
                            className="text-base text-lg text-gray-400 cursor-pointer"
                          />
                          <AiOutlineDelete
                            onClick={() => deleteIncome.mutate(trans._id)}
                            className="text-base text-xl text-gray-400 cursor-pointer"
                          />
                        </div>
                        <div className="font-bold text-xs md:text-sm text-teal-600 min-w-[60px] md:min-w-[70px] text-right">
                          +₹{trans.amount}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showAddIncomeModal && (
        <div className="w-screen fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50 z-40"></div>

          <div className="relative z-50 w-full max-w-xs md:max-w-xl px-2 md:px-3">
            <TransactionModal
              type="income"
              onClose={() => {
                setShowAddIncomeModal(false);
                setEditData(null);
              }}
              editData={editData}
              setEditData={setEditData}
              User_Id={session?.user?.id}
              addIncome={addIncome}
              updateIncome={updateIncome}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Income;
