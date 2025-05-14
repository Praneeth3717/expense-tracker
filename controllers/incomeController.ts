import Transaction, { ITransaction } from '../models/transactionModel'
import mongoose from 'mongoose'

interface IncomeDashboard {
  IncomeList: ITransaction[],
  IncomeData: {
    date: Date,
    amount: number
  }[]
}

export const AddIncome = async (newIncome: {
  category: string;
  amount: number;
  date: Date;
  userId:mongoose.Types.ObjectId
}): Promise<ITransaction> => {
  const income: ITransaction = new Transaction({
    ...newIncome,
    type: "income"
  });

  const SavedIncome: ITransaction = await income.save();

  return SavedIncome;
}

export const getIncome = async (userId: string): Promise<IncomeDashboard> => {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    const [IncomeList, IncomeData] = await Promise.all([
      Transaction.find({ userId:objectId ,type: 'income'}).sort({ date: -1 }),
      Transaction.aggregate([
        { $match: { userId:objectId,type: 'income' } },
        { $group: { _id: '$date', TotalAmount: { $sum: '$amount' } } },
        {
          $project: {
            _id: 0,
            date: '$_id',
            amount: '$TotalAmount'
          }
        },
        { $sort: { date: -1 } }, 
        { $limit: 10 },          
        { $sort: { date: 1 } }   
      ])
    ]);

    return {
      IncomeList,
      IncomeData
    }
  } catch (error) {
    console.error("Error fetching Income data:", error);
    throw new Error("Failed to fetch Income data");
  }
}

export const deleteIncome=async(id:string)=>{
  try {
    const deletedIncome=await Transaction.findByIdAndDelete(id)
    if(!deletedIncome){
      throw new Error('Income not found');
    }
    return deletedIncome;
  } catch (error) {
    console.error('Error deleting income:', error);
    throw new Error('Failed to delete Income');
  }
}

export const updateIncome=async(id:string,updateData: {
    category?: string;
    amount?: number;
    date?: Date;
  })=>{
  try {
    const updatedIncome=await Transaction.findByIdAndUpdate(id,updateData,{
      new: true,
    })
    return updatedIncome;
  } catch (error) {
    console.error('Error updating income:', error);
    throw new Error('Failed to update Income');
  }
}
