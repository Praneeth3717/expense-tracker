"use client"
import React from 'react'
import dayjs from 'dayjs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

type IncomeData = {
  date: string|Date;
  amount: number;
}

interface Chart5Props {
  IncomeData: IncomeData[];
}

const Chart5: React.FC<Chart5Props> = ({ IncomeData }) => {

  const formatDate = (date: Date) => {
    return dayjs(date).format("DD MMM");
  }

  if (IncomeData.length === 0) {
    return (
      <div className="w-full h-60 flex items-center justify-center text-gray-500">
        Add Income data to view Charts.
      </div>
    );
  }

  return (
    <div className='w-full h-60'>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={IncomeData}>
          <XAxis dataKey="date" tickFormatter={formatDate} />
          <YAxis />
          <Tooltip />
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
  )
}

export default Chart5
