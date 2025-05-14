import Transaction, { ITransaction } from "@/models/transactionModel";
import mongoose from "mongoose";

interface DashboardData{
  recentTransactions:ITransaction[],
  recentExpenses:ITransaction[],
  recentIncome:ITransaction[],
  totalIncome:number,
  totalExpense:number,
  totalBalance:number,
  expenseData:{
    category:string,
    amount:number
  }[]
  incomeData:{
    category:string,
    amount:number
  }[]
}

export const getDashboardData = async (User_Id:string):Promise<DashboardData> => {
  try {
    const objectId = new mongoose.Types.ObjectId(User_Id);

    const [
      recentTransactions, 
      recentExpenses, 
      recentIncome, 
      total,
      expenseData,
      incomeData
    ] = await Promise.all([
      Transaction.find({userId:objectId}).sort({ date: -1 }).limit(5),

      Transaction.find({userId:objectId,type: 'expense' }).sort({ date: -1 }).limit(5),

      Transaction.find({userId:objectId,type: 'income' }).sort({ date: -1 }).limit(5),

      Transaction.aggregate([
        {$match:{userId:objectId}},
        { $group: { _id: '$type', TotalAmount: { $sum: '$amount' } } }
      ]),

      Transaction.aggregate([
        {$match:{userId:objectId,type:'expense'}},
        {$group:{
          _id:{
            $cond:[{$lt:['$amount',100]},'Others','$category']
          },
          TotalAmount:{$sum:'$amount'}
        }},
        {$project:{
          _id:0,
          category:'$_id',
          amount:'$TotalAmount'
        }}
      ]),

      Transaction.aggregate([
        {$match:{userId:objectId,type:'income'}},
        {$group:{_id:'$category',TotalAmount:{$sum:'$amount'}}},
        {$project:{
          _id:0,
          category:'$_id',
          amount:'$TotalAmount'
        }}
      ])
    ]);


    const Income = total.find(item => item._id === 'income')?.TotalAmount || 0;
    const Expense = total.find(item => item._id === 'expense')?.TotalAmount || 0;

    const totalIncome=Math.round(Income)
    const totalExpense=Math.round(Expense)
    const totalBalance=Math.round(totalIncome-totalExpense)

    return {
      recentTransactions,
      recentExpenses,
      recentIncome,
      totalIncome,
      totalExpense,
      totalBalance,
      expenseData,
      incomeData
    };

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
};
