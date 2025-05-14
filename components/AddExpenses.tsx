"use client"
import React,{ChangeEvent, FormEvent, useState,useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface AddExpensesProps{
  onClose:()=>void,
  ReloadData:()=>void
  editData: Transaction | null
  setEditData: (data: Transaction | null) => void
  User_Id: string|undefined;
}

interface Transaction {
  _id: string;
  type: string;
  category: string;
  amount: number;
  date: string;
}

interface FormData{
  category:string,
  amount:string,
  date:string
}

const AddExpenses:React.FC<AddExpensesProps> = ({ onClose ,ReloadData,editData,setEditData,User_Id}) => {

    const [formData,setformData]=useState<FormData>({
      category:"",
      amount: "",
      date: "",
    })

    const HandleChange=(e:ChangeEvent<HTMLInputElement>)=>{
      setformData((prev)=>({
        ...prev,
        [e.target.name]:e.target.value
      }))
    }

    const handleSubmit = async (e:FormEvent) => {
      e.preventDefault();
      const FinalData={
        ...formData,
        amount:Number(formData.amount),
        userId: User_Id,
      }
      try {
        if(editData){
          await axios.patch(`/api/expense?id=${editData._id}`,FinalData)
          alert("Expense updated successfully!");
          setEditData(null)
        }
        else{
          await axios.post("/api/expense",FinalData)
          alert('Expense added successfully')
        }
        await ReloadData()
        onClose()
      } catch (error) {
        console.error("Error submitting expense:", error);
      }
    }; 
    
        useEffect(() => {
        if (editData) {
          setformData({
            category: editData.category,
            amount: String(editData.amount),
            date: editData.date.split("T")[0],
          });
        }
      }, [editData]);

  return (
    <div className="max-w-2xl w-full mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">{editData ? "Update Expense" : "Add Expense"}</h1>
        <FontAwesomeIcon
          icon={faTimes}
          className="text-gray-600 cursor-pointer text-xl"
          onClick={onClose}
        />
      </div>


      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="mb-1 text-sm text-gray-700 font-medium">Expense Category</label>
          <input
            name='category'
            value={formData.category}
            onChange={HandleChange}
            placeholder="Groceries, Rent, etc."
            className="p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm text-gray-700 font-medium">Amount</label>
          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={HandleChange}
            className="p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm text-gray-700 font-medium">Date</label>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={HandleChange}
            className="p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            required
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2"
          >
            {editData ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddExpenses
