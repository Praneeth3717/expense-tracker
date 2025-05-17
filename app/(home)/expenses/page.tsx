"use client"
import React,{ useState,useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import AddExpenses from '@/components/AddExpenses';
import Chart4 from '@/components/charts/Chart4'
import axios from 'axios';
import { useSession } from "next-auth/react";

type RecentExpenseData={
  date:Date,
  amount:number
}

interface Transaction{
  _id:string;
  type:string;
  category:string;
  amount:number;
  date:string
}

interface ExpenseDashboard{
    ExpensesList:Transaction[],
    ExpenseData:RecentExpenseData[]
}

const Expenses = () => {
  const { data: session } = useSession();
  const [showAddExpensesModal, setShowAddExpensesModal] = useState(false);  
  const [ExpenseDashboardData, setExpenseDashboardData] = useState<ExpenseDashboard>({
    ExpensesList:[],
    ExpenseData:[]
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Transaction | null>(null)
  
    const deleteExpense=async(id:string)=>{
      try {
        const response = await axios.delete(`/api/income?id=${id}`);
      if (response.data.success) {
        fetchExpenses();
      }
      } catch (error) {
        console.error("Error deleting income:", error);
        alert("Failed to delete income. Please try again.");
      }
    }
    
  const handleEditClick = (trans: Transaction) => {
    setEditData(trans);
    setShowAddExpensesModal(true);
  };

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get(`/api/expense?userId=${session?.user?.id}`);
      if (res.data.success) {
        setExpenseDashboardData(res.data.data);
        setError(null)
      }
    } catch (err) {
      console.error("Failed to fetch expense data", err);
      setError('Error fetching data');
    }
    finally{
      setLoading(false)
    }
  },[session?.user.id])
    useEffect(() => {
  if (session?.user?.id) {
    console.log("Session loaded, fetching Expense data...");
    fetchExpenses();
  }
}, [session,fetchExpenses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-blue-500"></div>
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
        <div className="p-2 md:p-4 bg-gray-100 min-h-[calc(100vh-3rem)] overflow-y-auto">
            <div className="space-y-3 md:space-y-4">
      
              {/* Expenses Overview Card */}
              <div className="rounded-lg bg-white p-3 md:p-4 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                  <div>
                    <h1 className="text-lg md:text-xl text-gray-800">Expenses Overview</h1>
                    <p className="text-xs text-gray-500">Track your earnings over time and analyze your income trends</p>
                  </div>
                  <button 
                    onClick={() => setShowAddExpensesModal(true)} 
                    className="mt-2 md:mt-0 px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full md:w-auto"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    Add Expenses
                  </button>
                </div>

                <div className="rounded-lg p-2 md:p-4 text-gray-600 text-center">
                  <Chart4 ExpenseData={ExpenseDashboardData.ExpenseData}/>
                </div>
              </div>
      
              {/* All Expenses Card */}
              <div className="rounded-lg bg-white p-3 md:p-4 shadow-sm">
                <div className="mb-3">
                  <h1 className="text-lg md:text-xl text-gray-800">All Expenses</h1>
                </div>
                <div className="rounded-lg p-2 md:p-4 text-gray-600">
                  <ul className="space-y-2 grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-x-6">
                    {ExpenseDashboardData.ExpensesList.map((trans)=>{
                      return (
                        <li 
                          key={trans._id} 
                          onMouseEnter={() => setHoveredItemId(trans._id)}
                          onMouseLeave={() => setHoveredItemId(null)} 
                          className="flex justify-between items-center p-1.5 md:p-2 hover:bg-gray-200 rounded-md"
                        >
                          <div className="flex items-center gap-1.5 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 text-base md:text-lg bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                              {trans.category.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h2 className="text-xs md:text-sm text-gray-800 font-medium">{trans.category}</h2>
                              <p className="text-xs text-gray-500">
                                {new Date(trans.date).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className='flex gap-1.5 md:gap-3 items-center'>
                            <div className={`flex gap-1.5 md:gap-2 ${hoveredItemId === trans._id ? 'opacity-100' : 'opacity-0'}`}>
                              <FontAwesomeIcon
                                onClick={() => handleEditClick(trans)}
                                icon={faEdit}
                                className="text-base md:text-lg text-gray-400 cursor-pointer"
                              />
                              <FontAwesomeIcon
                                onClick={() => deleteExpense(trans._id)}
                                icon={faTrash}
                                className="text-base md:text-lg text-gray-400 cursor-pointer"
                              />
                            </div>
                            <div className='font-bold text-xs md:text-sm text-orange-600 min-w-[60px] md:min-w-[70px] text-right'>
                              -₹{trans.amount}
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
      
            </div>
          </div>
          {showAddExpensesModal && (
          <div className="w-screen fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50 z-40"></div>

            <div className="relative z-50 w-full max-w-xs md:max-w-xl px-2 md:px-3">
              <AddExpenses 
                onClose={() => { 
                  setShowAddExpensesModal(false)
                  setEditData(null)
                }} 
                ReloadData={fetchExpenses} 
                editData={editData} 
                setEditData={setEditData} 
                User_Id={session?.user.id}
              />
            </div>
          </div>
      )}
    </>
  )
}

export default Expenses