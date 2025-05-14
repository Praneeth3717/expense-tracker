// "use client"
// import React,{ useState,useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus,faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
// import AddExpenses from '@/components/AddExpenses';
// import Chart4 from '@/components/charts/Chart4'
// import axios from 'axios';
// import { useSession } from "next-auth/react";

// type RecentExpenseData={
//   date:Date,
//   amount:number
// }

// interface Transaction{
//   _id:string;
//   type:string;
//   category:string;
//   amount:number;
//   date:string
// }

// interface ExpenseDashboard{
//     ExpensesList:Transaction[],
//     ExpenseData:RecentExpenseData[]
// }

// const Expenses = () => {
//   const { data: session } = useSession();
//   const [showAddExpensesModal, setShowAddExpensesModal] = useState(false);  
//   const [ExpenseDashboardData, setExpenseDashboardData] = useState<ExpenseDashboard>({
//     ExpensesList:[],
//     ExpenseData:[]
//   });
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
//   const [editData, setEditData] = useState<Transaction | null>(null)
  
//     const deleteExpense=async(id:string)=>{
//       try {
//         const response = await axios.delete(`/api/income?id=${id}`);
//       if (response.data.success) {
//         fetchExpenses();
//       }
//       } catch (error) {
//         console.error("Error deleting income:", error);
//         alert("Failed to delete income. Please try again.");
//       }
//     }
    
//   const handleEditClick = (trans: Transaction) => {
//     setEditData(trans);
//     setShowAddExpensesModal(true);
//   };

//   const fetchExpenses = async () => {
//     setLoading(true)
//     try {
//       const res = await axios.get(`/api/expense?userId=${session?.user?.id}`);
//       if (res.data.success) {
//         setExpenseDashboardData(res.data.data);
//         setError(null)
//       }
//     } catch (err) {
//       console.error("Failed to fetch expense data", err);
//       setError('Error fetching data');
//     }
//     finally{
//       setLoading(false)
//     }
//   };
//     useEffect(() => {
//   if (session?.user?.id) {
//     console.log("Session loaded, fetching Expense data...");
//     fetchExpenses();
//   }
// }, [session]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-red-500">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <>
//         <div className="p-5 bg-gray-100 min-h-[calc(100vh-4rem)] overflow-y-auto">
//             <div className="space-y-5">
      
//               {/* Income Overview Card */}
//               <div className="rounded-xl bg-white p-6 shadow-md">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
//                   <div>
//                     <h1 className="text-2xl text-gray-800">Expenses Overview</h1>
//                     <p className="text-sm text-gray-500">Track your earnings over time and analyze your income trends</p>
//                   </div>
//                   <button 
//                     onClick={() => setShowAddExpensesModal(true)} 
//                     className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//                   >
//                   <FontAwesomeIcon icon={faPlus} />
//                     Add Expenses
//                   </button>
//                 </div>

//                 <div className="rounded-lg p-6 text-gray-600 text-center">
//                   <Chart4 ExpenseData={ExpenseDashboardData.ExpenseData}/>
//                 </div>
//               </div>
      
//               {/* Income Sources Card */}
//               <div className="rounded-xl bg-white p-6 shadow-md">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
//                   <h1 className="text-2xl text-gray-800">All Expenses</h1>
//                 </div>
//                 <div className="rounded-lg p-6 text-gray-600 ">
//                   <ul className="space-y-4 p-4 grid grid-cols-1 md:grid-cols-2 gap-x-20">
//                     {ExpenseDashboardData.ExpensesList.map((trans)=>{
//                       return (
//                         <li 
//                         key={trans._id} 
//                         onMouseEnter={() => setHoveredItemId(trans._id)}
//                         onMouseLeave={() => setHoveredItemId(null)} 
//                         className="flex justify-between items-center p-3 hover:bg-gray-200 rounded-md"
//                         >
//                           <div className="flex items-center gap-4">
//                             <div className="w-15 h-15 text-2xl bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
//                               {trans.category.charAt(0).toUpperCase()}
//                             </div>
//                             <div>
//                               <h2 className="text-gray-800 font-medium">{trans.category}</h2>
//                               <p className="text-sm text-gray-500">
//                                 {new Date(trans.date).toLocaleDateString('en-GB', {
//                                   day: '2-digit',
//                                   month: 'long',
//                                   year: 'numeric'
//                                 })}
//                               </p>
//                             </div>
//                           </div>
//                                   <div className='flex gap-5'>
//                                     <div  className={`flex gap-3  ${hoveredItemId === trans._id ? 'opacity-100' : 'opacity-0'}`}>
//                                     <FontAwesomeIcon
//                                       onClick={() => handleEditClick(trans)}
//                                       icon={faEdit}
//                                       className="text-2xl text-gray-400 cursor-pointer"
//                                     />
//                                     <FontAwesomeIcon
//                                       onClick={()=>deleteExpense(trans._id)}
//                                       icon={faTrash}
//                                       className="text-2xl text-gray-400 cursor-pointer"
//                                     />
//                                   </div>
//                                   <div className='font-semibold text-lg text-orange-600'>
//                                     -₹{trans.amount}
//                                   </div>
//                                   </div>
//         </li>
//         )
//       })}
//     </ul>
//           </div>
//               </div>
      
//             </div>
//           </div>
//           {showAddExpensesModal && (
//           <div className="w-screen fixed inset-0 z-50 flex items-center justify-center">
    
//     <div className="absolute inset-0 bg-black opacity-50 z-40"></div>

//     <div className="relative z-50 w-full max-w-2xl px-4">
//             <AddExpenses onClose={() =>{ setShowAddExpensesModal(false)
//               setEditData(null)
//             }} ReloadData={fetchExpenses} editData={editData} setEditData={setEditData} User_Id={session?.user.id}/>
//             </div>
    
//     </div>
//       )}
//     </>
//   )
// }

// export default Expenses


"use client"
import React,{ useState,useEffect } from 'react';
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

  const fetchExpenses = async () => {
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
  };
    useEffect(() => {
  if (session?.user?.id) {
    console.log("Session loaded, fetching Expense data...");
    fetchExpenses();
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
        <div className="p-3 md:p-5 bg-gray-100 min-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="space-y-4 md:space-y-5">
      
              {/* Expenses Overview Card */}
              <div className="rounded-xl bg-white p-4 md:p-6 shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h1 className="text-xl md:text-2xl text-gray-800">Expenses Overview</h1>
                    <p className="text-xs md:text-sm text-gray-500">Track your earnings over time and analyze your income trends</p>
                  </div>
                  <button 
                    onClick={() => setShowAddExpensesModal(true)} 
                    className="mt-3 md:mt-0 px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full md:w-auto"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    Add Expenses
                  </button>
                </div>

                <div className="rounded-lg p-2 md:p-6 text-gray-600 text-center">
                  <Chart4 ExpenseData={ExpenseDashboardData.ExpenseData}/>
                </div>
              </div>
      
              {/* All Expenses Card */}
              <div className="rounded-xl bg-white p-4 md:p-6 shadow-md">
                <div className="mb-4">
                  <h1 className="text-xl md:text-2xl text-gray-800">All Expenses</h1>
                </div>
                <div className="rounded-lg p-2 md:p-6 text-gray-600">
                  <ul className="space-y-3 grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-x-8">
                    {ExpenseDashboardData.ExpensesList.map((trans)=>{
                      return (
                        <li 
                          key={trans._id} 
                          onMouseEnter={() => setHoveredItemId(trans._id)}
                          onMouseLeave={() => setHoveredItemId(null)} 
                          className="flex justify-between items-center p-2 md:p-3 hover:bg-gray-200 rounded-md"
                        >
                          <div className="flex items-center gap-2 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 text-lg md:text-2xl bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                              {trans.category.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h2 className="text-sm md:text-base text-gray-800 font-medium">{trans.category}</h2>
                              <p className="text-xs md:text-sm text-gray-500">
                                {new Date(trans.date).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className='flex gap-2 md:gap-5 items-center'>
                            <div className={`flex gap-2 md:gap-3 ${hoveredItemId === trans._id ? 'opacity-100' : 'opacity-0'}`}>
                              <FontAwesomeIcon
                                onClick={() => handleEditClick(trans)}
                                icon={faEdit}
                                className="text-lg md:text-2xl text-gray-400 cursor-pointer"
                              />
                              <FontAwesomeIcon
                                onClick={() => deleteExpense(trans._id)}
                                icon={faTrash}
                                className="text-lg md:text-2xl text-gray-400 cursor-pointer"
                              />
                            </div>
                            <div className='font-semibold text-sm md:text-lg text-orange-600 min-w-[70px] md:min-w-[80px] text-right'>
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

            <div className="relative z-50 w-full max-w-md md:max-w-2xl px-3 md:px-4">
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