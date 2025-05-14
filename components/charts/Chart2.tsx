"use client"
import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type ExpenseData={
  category:string,
  amount:number
}

interface Chart2Props{
  expenseData:ExpenseData[]
}

const Chart2:React.FC<Chart2Props> = ({expenseData}) => {

    if (expenseData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No expense data available to display Charts.
      </div>
    );
  }

  return (

    <div className="w-full h-full flex items-center justify-center">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={expenseData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis  />
        <Tooltip formatter={(value: number) => `₹ ${value}`} />
        <Legend />
        <Bar dataKey="amount" fill="#FA8072" />
      </BarChart>
    </ResponsiveContainer>
  </div>
  )
}

export default Chart2
