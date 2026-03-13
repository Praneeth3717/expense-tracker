"use client";
import React from "react";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DateChartData } from "@/types/dashboard";

interface Chart5Props {
  incomeData: DateChartData[];
}

const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 400;

const Chart5: React.FC<Chart5Props> = ({ incomeData }) => {
  const formatDate = (date: Date) => {
    return dayjs(date).format("DD MMM");
  };

  if (incomeData.length === 0) {
    return (
      <div className="w-full h-60 flex items-center justify-center text-gray-500">
        Add Income data to view Charts.
      </div>
    );
  }

  return (
    <div className="w-full h-60">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={incomeData}>
          <XAxis
            dataKey="transactionDate"
            tickFormatter={formatDate}
            tick={{ fontSize: isSmallScreen ? 8 : 12 }}
          />

          <YAxis
            tick={{ fontSize: isSmallScreen ? 8 : 12 }}
            width={isSmallScreen ? 28 : 40}
            tickCount={isSmallScreen ? 4 : 7}
          />
          <Tooltip
            labelFormatter={() => ""}
            formatter={(value) => [`₹${value}`, "Amount"]}
          />

          <Legend />
          <Bar
            name="Daily Income"
            dataKey="amount"
            fill="#82ca9d"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart5;
