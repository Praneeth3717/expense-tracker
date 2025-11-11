"use client"
import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill, faArrowDown, faArrowUp, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Chart1 from '@/components/charts/Chart1';
import Chart2 from '@/components/charts/Chart2';
import Chart3 from '@/components/charts/Chart3';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';

// Define TypeScript interfaces
interface Transaction {
  _id: string;
  category: string;
  date: Date;
  type: string;
  amount: number;
}

type fetchedData={
  category:string,
  amount:number
}

interface DashboardData {
  recentTransactions: Transaction[];
  recentIncome: Transaction[];
  recentExpenses: Transaction[];
  totalIncome: number;
  totalExpense: number;
  totalBalance:number;
  expenseData:fetchedData[]
  incomeData:fetchedData[]
}

export default function Page() {
  const {data:session}=useSession()
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    recentTransactions: [],
    recentIncome: [],
    recentExpenses: [],
    totalIncome: 0,
    totalExpense: 0,
    totalBalance:0,
    expenseData:[],
    incomeData:[]
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const fetchDasboardData=useCallback(async()=>{
    setLoading(true)
    try {
      const response = await axios.get(`/api/transactions?userId=${session?.user.id}`); // The endpoint for your dashboard data
      const data = response.data;

      if (data.success) {
        setDashboardData(data.data) 
        setError(null)
      }else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error fetching data');
    }finally {
      setLoading(false); // Stop loading when the request is finished
    }
  },[session?.user.id])

  useEffect(() => {
    if (session?.user?.id) {
      console.log("Session loaded, fetching income data...");
      fetchDasboardData();
    } else {
      console.log("Session not loaded yet...");
    }
  }, [session,fetchDasboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-lg p-3 flex items-center gap-2 shadow-md">
          <FontAwesomeIcon icon={faMoneyBill} className="text-2xl p-1 text-gray-600" />
          <div>
            <div className="text-xs md:text-sm text-gray-800">Total Balance</div>
            <div className='text-lg md:text-xl text-gray-500'>₹ {dashboardData.totalBalance}</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 flex items-center gap-2 shadow-md">
          <FontAwesomeIcon icon={faArrowUp} className="text-2xl p-1 text-green-600" />
          <div>
            <div className="text-xs md:text-sm text-gray-800">Total Income</div>
            <div className='text-lg md:text-xl text-gray-500'>₹ {dashboardData.totalIncome}</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 flex items-center gap-2 shadow-md">
          <FontAwesomeIcon icon={faArrowDown} className="text-2xl p-1 text-red-600" />
          <div>
            <div className="text-xs md:text-sm text-gray-800">Total Expenses</div>
            <div className='text-lg md:text-xl text-gray-500'>₹ {dashboardData.totalExpense}</div>
          </div>
        </div>
      </div>

      {/* Bottom Grid (3 Sections) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-5 h-[470px]">
         <div className="flex justify-between items-center p-3">
          <h1 className="text-lg text-gray-800">Recent Transactions</h1>
         </div>
         <ul className="space-y-4 p-3">
          {dashboardData.recentTransactions?.map((trans) => {
            return (
             <li key={trans._id} className="flex justify-between items-center pb-3">
             <div className="flex items-center gap-4">
              <div className={`w-12 h-12 text-xl rounded-full flex items-center justify-center font-bold 
                ${trans.type==='expense'?'bg-orange-100 text-orange-500':'bg-teal-100 text-teal-700'}`}>
               {trans.category.charAt(0).toUpperCase()}
              </div>
              <div>
               <h2 className="text-gray-800 font-medium text-sm">{trans.category}</h2>
               <p className="text-xs text-gray-500">
               {new Date(trans.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
               </p>
              </div>
            </div>
            <div className={`font-medium text-base ${trans.type === 'expense' ? 'text-orange-600' : 'text-teal-600'}`}>
             {trans.type === 'expense' ? '-' : '+'}₹{trans.amount}
            </div>
        </li>
        )
      })}
    </ul>
  </div>

        {/* Financial Overview */}
        <div className="bg-white rounded-lg shadow-md p-5 h-[470px]">
          <h1 className="text-lg text-gray-800 p-2">Financial Overview</h1>
          <div className="w-full h-[370px] mx-auto">
            <Chart1 
              TotalBalance={dashboardData.totalBalance} 
              TotalExpenses={dashboardData.totalExpense} 
              TotalIncome={dashboardData.totalIncome} 
            />
          </div>
        </div>

        {/* Last 60 Days Expenses */}
        <div className="bg-white rounded-lg shadow-md p-5 h-[470px]">
          <h1 className="text-lg text-gray-800 p-2">Last 60 Days Expenses</h1>
          <div className="w-full h-[370px] m-3 mx-0">
            <Chart2 expenseData={dashboardData.expenseData}/>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white rounded-lg shadow-md p-5 h-[470px]">
         <div className="flex justify-between items-center p-3">
          <h1 className="text-lg text-gray-800">Expenses</h1>
          <button onClick={() => router.push('./expenses')} className="font-medium text-xs py-1 px-2 rounded-md bg-gray-200 text-gray-800">
           See All 
           <FontAwesomeIcon className='px-1 text-xs' icon={faArrowRight}/>
          </button>
         </div>
         <ul className="space-y-4 p-3">
          {dashboardData.recentExpenses?.map((trans) => {
            return (
             <li key={trans._id} className="flex justify-between items-center pb-3">
             <div className="flex items-center gap-4">
              <div className="w-12 h-12 text-xl bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
               {trans.category.charAt(0)}
              </div>
              <div>
               <h2 className="text-gray-800 font-medium text-sm">{trans.category}</h2>
               <p className="text-xs text-gray-500">
               {new Date(trans.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
               </p>
              </div>
            </div>
            <div className='font-medium text-base text-orange-600'>
             {trans.type === 'expense' ? '-' : '+'}₹{trans.amount}
            </div>
        </li>
        )
      })}
    </ul>
  </div>

  {/* Income */}
  <div className="bg-white rounded-lg shadow-md p-5 h-[470px]">
     <div className="flex justify-between items-center p-3">
      <h1 className="text-lg text-gray-800">Income</h1>
      <button onClick={() => router.push('./income')} className="font-medium text-xs py-1 px-2 rounded-md bg-gray-200 text-gray-800">
       See All 
       <FontAwesomeIcon className='px-1 text-xs' icon={faArrowRight}/>
      </button>
     </div>
     <ul className="space-y-4 p-3">
      {dashboardData.recentIncome?.map((trans) => {
        return (
         <li key={trans._id} className="flex justify-between items-center pb-3">
         <div className="flex items-center gap-4">
          <div className="w-12 h-12 text-xl bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">
           {trans.category.charAt(0).toUpperCase()}
          </div>
          <div>
           <h2 className="text-gray-800 font-medium text-sm">{trans.category}</h2>
           <p className="text-xs text-gray-500">
           {new Date(trans.date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
           </p>
          </div>
        </div>
        <div className='font-medium text-base text-teal-600'>
         +₹{trans.amount}
        </div>
      </li>
      )
    })}
    </ul>
  </div>

        {/* Last 60 Days Expenses */}
        <div className="bg-white rounded-lg shadow-md p-4 h-[470px]">
          <h1 className="text-lg text-gray-800 p-2">Last 60 Days Income</h1>
          <div className="w-full h-[370px] mx-auto">
            <Chart3 incomeData={dashboardData.incomeData}/>
          </div>
        </div>
      </div>
    </>
  );
}

