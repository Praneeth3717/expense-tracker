"use client";
import dayjs from "dayjs";
import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DateChartData } from "@/types/dashboard";

interface Chart3Props {
  expenseData: DateChartData[];
}

const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 400;

const Chart4: React.FC<Chart3Props> = ({ expenseData }) => {
  const formatDate = (date: Date) => {
    return dayjs(date).format("DD MMM");
  };

  if (expenseData.length === 0) {
    return (
      <div className="w-full h-60 flex items-center justify-center text-gray-500">
        Add expense data to view Charts.
      </div>
    );
  }

  return (
    <div className="w-full h-60">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={expenseData}>
          <defs>
            <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF8042" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#FF8042" stopOpacity={0} />
            </linearGradient>
          </defs>

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

          <Area
            type="monotone"
            dataKey="amount"
            stroke="#FF8042"
            strokeWidth={3}
            fillOpacity={5}
            fill="url(#colorFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart4;
