"use client"
import { useState, useEffect } from 'react';
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


  const fetchDasboardData=async()=>{
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
  }

  useEffect(() => {
    if (session?.user?.id) {
      console.log("Session loaded, fetching income data...");
      fetchDasboardData();
    } else {
      console.log("Session not loaded yet...");
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-md">
          <FontAwesomeIcon icon={faMoneyBill} className="text-3xl p-2 text-gray-600" />
          <div>
            <div className="text-sm md:text-base">Total Balance</div>
            <div className='text-xl md:text-2xl'>₹ {dashboardData.totalBalance}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-md">
          <FontAwesomeIcon icon={faArrowUp} className="text-3xl p-2 text-green-600" />
          <div>
            <div className="text-sm md:text-base">Total Income</div>
            <div className='text-xl md:text-2xl'>₹ {dashboardData.totalIncome}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-md">
          <FontAwesomeIcon icon={faArrowDown} className="text-3xl p-2 text-red-600" />
          <div>
            <div className="text-sm md:text-base">Total Expenses</div>
            <div className='text-xl md:text-2xl'>₹ {dashboardData.totalExpense}</div>
          </div>
        </div>
      </div>

      {/* Bottom Grid (3 Sections) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-xl/30 p-6 h-[565px]">
         <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl text-gray-800">Recent Transactions</h1>
         </div>
         <ul className="space-y-4 p-4">
          {dashboardData.recentTransactions?.map((trans) => {
            return (
             <li key={trans._id} className="flex justify-between items-center pb-3">
             <div className="flex items-center gap-4">
              <div className={`w-15 h-15 text-2xl rounded-full flex items-center justify-center font-bold 
                ${trans.type==='expense'?'bg-orange-100 text-orange-500':'bg-teal-100 text-teal-700'}`}>
               {trans.category.charAt(0).toUpperCase()}
              </div>
              <div>
               <h2 className="text-gray-800 font-medium">{trans.category}</h2>
               <p className="text-sm text-gray-500">
               {new Date(trans.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
               </p>
              </div>
            </div>
            <div className={`font-semibold text-lg ${trans.type === 'expense' ? 'text-orange-600' : 'text-teal-600'}`}>
             {trans.type === 'expense' ? '-' : '+'}₹{trans.amount}
            </div>
        </li>
        )
      })}
    </ul>
  </div>

        {/* Financial Overview */}
        <div className="bg-white rounded-xl shadow-xl/30 p-6 h-[565px]">
          <h1 className="text-xl sm:text-2xl text-gray-800 p-2 sm:p-3">Financial Overview</h1>
          <div className="w-full h-[450px] mx-auto">
            <Chart1 
              TotalBalance={dashboardData.totalBalance} 
              TotalExpenses={dashboardData.totalExpense} 
              TotalIncome={dashboardData.totalIncome} 
            />
          </div>
        </div>

        {/* Last 60 Days Expenses */}
        <div className="bg-white rounded-xl shadow-xl/30 p-6 h-[565px]">
          <h1 className="text-xl sm:text-2xl text-gray-800 p-2 sm:p-3">Last 60 Days Expenses</h1>
          <div className="w-full h-[450px] mx-auto">
            <Chart2 expenseData={dashboardData.expenseData}/>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white rounded-xl shadow-xl/30 p-6 h-[565px]">
         <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl text-gray-800">Expenses</h1>
          <button onClick={() => router.push('./expenses')} className="font-medium text-sm py-1.5 px-2 rounded-md bg-gray-200">
           See All 
           <FontAwesomeIcon className='px-2 text-sm' icon={faArrowRight}/>
          </button>
         </div>
         <ul className="space-y-4 p-4">
          {dashboardData.recentExpenses?.map((trans) => {
            return (
             <li key={trans._id} className="flex justify-between items-center pb-3">
             <div className="flex items-center gap-4">
              <div className="w-15 h-15 text-2xl bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
               {trans.category.charAt(0)}
              </div>
              <div>
               <h2 className="text-gray-800 font-medium">{trans.category}</h2>
               <p className="text-sm text-gray-500">
               {new Date(trans.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
               </p>
              </div>
            </div>
            <div className='font-semibold text-lg text-orange-600'>
             {trans.type === 'expense' ? '-' : '+'}₹{trans.amount}
            </div>
        </li>
        )
      })}
    </ul>
  </div>

  {/* Income */}
  <div className="bg-white rounded-xl shadow-xl/30 p-6 h-[565px]">
     <div className="flex justify-between items-center p-4">
      <h1 className="text-2xl text-gray-800">Income</h1>
      <button onClick={() => router.push('./income')} className="font-medium text-sm py-1.5 px-2 rounded-md bg-gray-200">
       See All 
       <FontAwesomeIcon className='px-2 text-sm' icon={faArrowRight}/>
      </button>
     </div>
     <ul className="space-y-4 p-4">
      {dashboardData.recentIncome?.map((trans) => {
        return (
         <li key={trans._id} className="flex justify-between items-center pb-3">
         <div className="flex items-center gap-4">
          <div className="w-15 h-15 text-2xl bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">
           {trans.category.charAt(0).toUpperCase()}
          </div>
          <div>
           <h2 className="text-gray-800 font-medium">{trans.category}</h2>
           <p className="text-sm text-gray-500">
           {new Date(trans.date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
           </p>
          </div>
        </div>
        <div className='font-semibold text-lg text-teal-600'>
         +₹{trans.amount}
        </div>
      </li>
      )
    })}
    </ul>
  </div>

        {/* Last 60 Days Expenses */}
        <div className="bg-white rounded-xl shadow-xl/30 p-6 h-[565px]">
          <h1 className="text-xl sm:text-2xl text-gray-800 p-2 sm:p-3">Last 60 Days Income</h1>
          <div className="w-full h-[450px] mx-auto">
            <Chart3 incomeData={dashboardData.incomeData}/>
          </div>
        </div>
      </div>
    </>
  );
}