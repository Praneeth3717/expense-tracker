"use client";
import React from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface Chart1Props {
  TotalBalance: number;
  TotalIncome: number;
  TotalExpenses: number;
}
interface DataItem {
  name: string;
  value: number;
  color: string;
}

const Chart1: React.FC<Chart1Props> = ({
  TotalBalance,
  TotalIncome,
  TotalExpenses,
}) => {
  const data: DataItem[] = [
    {
      name: "Income",
      value: isNaN(TotalIncome) ? 0 : TotalIncome,
      color: "#00C49F",
    },
    {
      name: "Expenses",
      value: isNaN(TotalExpenses) ? 0 : TotalExpenses,
      color: "#FF8042",
    },
    {
      name: "Balance",
      value: isNaN(TotalBalance) ? 0 : TotalBalance > 0 ? TotalBalance : 0,
      color: "#0088FE",
    },
  ];

  if (data.every((item) => item.value === 0)) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 text-center">
        No data available to display charts.
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `₹ ${value}`} />
          <Legend verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart1;
