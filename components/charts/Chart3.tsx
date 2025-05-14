"use client"
import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts'

type IncomeData={
  category: string;
  amount: number;
}

interface Chart3Props {
  incomeData: IncomeData[];
}

const Chart3: React.FC<Chart3Props> = ({ incomeData }) => {
  const COLORS = [
  '#A28CF0',
  '#00C49F',
  '#FFBB28',
  '#8E44AD',
  '#FF6F61',
  '#0088FE',
  '#7DCEA0',
  '#F39C12',
  '#D35400',
  '#FF8042',
];

  if (incomeData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No income data available to display Charts.
      </div>
    );
  }

  return (
    <div className='w-full h-full'>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={incomeData}
            dataKey='amount'
            nameKey='category'
            cx='50%'
            cy='50%'
            innerRadius={90}
            outerRadius={130}
          >
            {incomeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `₹ ${value}`} />
          <Legend verticalAlign='bottom' />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart3