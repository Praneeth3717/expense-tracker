"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useDashboard from "@/hooks/useDashboard";

import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { BsGraphUpArrow, BsGraphDownArrow } from "react-icons/bs";

import Chart1 from "@/components/charts/Chart1";
import Chart2 from "@/components/charts/Chart2";
import Chart3 from "@/components/charts/Chart3";

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  const { data:dashboardData , isLoading, isError } = useDashboard(session?.user.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-sm">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <>
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-lg p-3 flex items-center gap-5 shadow-md">
          <GiMoneyStack className="text-5xl p-1 text-gray-600" />
          <div>
            <div className="text-xs md:text-sm text-gray-800">
              Total Balance
            </div>
            <div className="text-lg md:text-xl text-gray-500">
              ₹ {dashboardData.totalBalance}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 flex items-center gap-5 shadow-md">
          <BsGraphUpArrow className="text-3xl p-1 text-green-600" />
          <div>
            <div className="text-xs md:text-sm text-gray-800">Total Income</div>
            <div className="text-lg md:text-xl text-gray-500">
              ₹ {dashboardData.totalIncome}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 flex items-center gap-5 shadow-md">
          <BsGraphDownArrow className="text-3xl p-1 text-red-600" />
          <div>
            <div className="text-xs md:text-sm text-gray-800">
              Total Expenses
            </div>
            <div className="text-lg md:text-xl text-gray-500">
              ₹ {dashboardData.totalExpense}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-5 h-[470px]">
          <div className="flex justify-between items-center p-3">
            <h1 className="text-lg text-gray-800">Recent Transactions</h1>
          </div>
          <ul className="space-y-4 p-3">
            {dashboardData.recentTransactions.map((trans) => (
              <li
                key={trans._id}
                className="flex justify-between items-center pb-3"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 text-xl rounded-full flex items-center justify-center font-bold 
                      ${
                        trans.type === "expense"
                          ? "bg-orange-100 text-orange-500"
                          : "bg-teal-100 text-teal-700"
                      }`}
                  >
                    {trans.category.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-gray-800 font-medium text-sm">
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
                <div
                  className={`font-medium text-base ${
                    trans.type === "expense"
                      ? "text-orange-600"
                      : "text-teal-600"
                  }`}
                >
                  {trans.type === "expense" ? "-" : "+"}₹{trans.amount}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Financial Overview */}
        <div className="bg-white rounded-lg shadow-md p-5 h-auto min-h-[400px] md:h-[470px]">
          <h1 className="text-lg text-gray-800 p-2">Financial Overview</h1>
          <div className="w-full h-[300px] sm:h-[350px] md:h-[370px] mx-auto">
            <Chart1
              TotalBalance={dashboardData.totalBalance}
              TotalExpenses={dashboardData.totalExpense}
              TotalIncome={dashboardData.totalIncome}
            />
          </div>
        </div>

        {/* Last 60 Days Expenses */}
        <div className="bg-white rounded-lg shadow-md p-5 h-auto min-h-[400px] md:h-[470px] flex flex-col gap-3">
          <h1 className="text-lg text-gray-800 p-2">Last 60 Days Expenses</h1>
          <div className="w-full h-[320px] sm:h-[360px] md:h-[380px] mx-auto">
            <Chart2 expenseData={dashboardData.expenseData} />
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white rounded-lg shadow-md p-5 h-[470px]">
          <div className="flex justify-between items-center p-3">
            <h1 className="text-lg text-gray-800">Expenses</h1>
            <button
              onClick={() => router.push("./expenses")}
              className="font-medium text-xs py-1 px-2 rounded-md bg-gray-200 text-gray-800 flex items-center justify-center gap-1"
            >
              View All
              <MdOutlineKeyboardArrowRight className="text-lg" />
            </button>
          </div>

          <ul className="space-y-4 p-3">
            {dashboardData.recentExpenses.map((trans) => (
              <li
                key={trans._id}
                className="flex justify-between items-center pb-3"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 text-xl bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                    {trans.category.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-gray-800 font-medium text-sm">
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
                <div className="font-medium text-base text-orange-600">
                  -₹{trans.amount}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Income List */}
        <div className="bg-white rounded-lg shadow-md p-5 h-[470px]">
          <div className="flex justify-between items-center p-3">
            <h1 className="text-lg text-gray-800">Income</h1>
            <button
              onClick={() => router.push("./income")}
              className="font-medium text-xs py-1 px-2 rounded-md bg-gray-200 text-gray-800 flex items-center justify-center gap-1"
            >
              View All
              <MdOutlineKeyboardArrowRight className="text-lg" />
            </button>
          </div>

          <ul className="space-y-4 p-3">
            {dashboardData.recentIncome.map((trans) => (
              <li
                key={trans._id}
                className="flex justify-between items-center pb-3"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 text-xl bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">
                    {trans.category.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-gray-800 font-medium text-sm">
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
                <div className="font-medium text-base text-teal-600">
                  +₹{trans.amount}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Last 60 Days Income */}
        <div className="bg-white rounded-lg shadow-md p-4 h-auto min-h-[400px] md:h-[470px]">
          <h1 className="text-lg text-gray-800 p-2">Last 60 Days Income</h1>
          <div className="w-full h-[300px] sm:h-[350px] md:h-[370px] mx-auto">
            <Chart3 incomeData={dashboardData.incomeData} />
          </div>
        </div>
      </div>
    </>
  );
}
