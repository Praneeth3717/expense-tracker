"use client"
import dayjs from 'dayjs'
import React from 'react';
import {Area,AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type ExpenseData={
  date: string|Date;
  amount: number;
}

interface Chart3Props {
  ExpenseData: ExpenseData[];
}

const Chart4:React.FC<Chart3Props> = ({ExpenseData}) => {
  
const formatDate = (date:Date) => {
  return dayjs(date).format("DD MMM")
}

  if (ExpenseData.length === 0) {
    return (
      <div className="w-full h-72 flex items-center justify-center text-gray-500">
        Add expense data to view Charts.
      </div>
    );
  }

  return (
    <div className='w-full h-72'>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={ExpenseData}>
          <defs>
            <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF8042" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#FF8042" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey="date" tickFormatter={formatDate}/>
          <YAxis />
          <Tooltip />

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
  )
}

export default Chart4

