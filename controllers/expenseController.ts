import Transaction, { ITransaction } from "@/models/transactionModel";
import mongoose from 'mongoose'

interface ExpenseDashboard{
    ExpenseList:ITransaction[],
    ExpenseData:{
        date:Date,
        amount:number
    }[]
}

export const AddExpense=async(newExpense:{
    category:string,
    amount:number,
    date:Date
    userId:mongoose.Types.ObjectId
}):Promise<ITransaction>=>{
    const expense:ITransaction=new Transaction({
        ...newExpense,
        type:'expense'
    })

    const SavedExpense:ITransaction=await expense.save()

    return SavedExpense
}

export const getExpenses=async(userId: string):Promise<ExpenseDashboard>=>{
    try {
        const objectId = new mongoose.Types.ObjectId(userId);
        const [ExpenseList,ExpenseData]=await Promise.all([
            Transaction.find({userId:objectId,type:'expense'}).sort({date:-1}),
            Transaction.aggregate([
                {$match:{userId:objectId,type:'expense'}},
                {$group:{_id:'$date',TotalAmount:{$sum:'$amount'}}},
                {$project:{
                    _id:0,
                    date:'$_id',
                    amount:'$TotalAmount'
                }},
                {$sort:{date:-1}},
                {$limit:10},
                {$sort:{date:1}}
            ])
        ])
        return {
            ExpenseList,
            ExpenseData
        }
    } catch (error) {
        console.error("Error fetching Expense data:", error);
        throw new Error("Failed to fetch Expense data");
    }
}

export const deleteExpense=async(id:string)=>{
  try {
    const deletedExpense=await Transaction.findByIdAndDelete(id)
    if(!deletedExpense){
      throw new Error('Income not found');
    }
    return deletedExpense;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw new Error('Failed to delete expense');
  }
}

export const updateExpense=async(id:string,updateData:{
    category?:string,
    amount?:number,
    date?:Date
})=>{
    try {
        const updatedExpense=await Transaction.findByIdAndUpdate(id,updateData,{new:true})
        return updatedExpense
    } catch (error) {
        console.error('Error updating expense:', error);
        throw new Error('Failed to update Expense');
    }
}