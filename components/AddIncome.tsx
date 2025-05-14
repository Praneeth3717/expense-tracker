"use client"
import React, { ChangeEvent, FormEvent, useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface AddIncomeProps{
  onClose:()=>void
  ReloadData:()=>void 
  editData: Transaction  | null
  setEditData: (data: Transaction | null) => void
  User_Id: string;
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

const AddIncome:React.FC<AddIncomeProps> = ({ onClose,ReloadData,editData,setEditData,User_Id }) => {

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
      if (editData) {
        await axios.patch(`/api/income?id=${editData._id}`, FinalData);
        alert("Income updated successfully!");
        setEditData(null)

      } else {
        await axios.post("/api/income", FinalData);
        alert("Income added successfully!");
      }
      await ReloadData();
      onClose();
    } catch (error) {
      console.error("Error submitting income:", error);
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
    <>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">{editData ? "Edit Income" : "Add Income"}</h1>
          <FontAwesomeIcon icon={faTimes} onClick={() => {
              onClose();
              setEditData(null);
            }} className="text-gray-600 cursor-pointer text-xl" />
        </div>


        <form className="space-y-5"  onSubmit={handleSubmit}>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700 font-medium">Income Source</label>
            <input
              name='category'
              value={formData.category}
              onChange={HandleChange}
              placeholder="Freelance, Salary, etc."
              className="p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
              className="p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
              className="p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2"
            >
              {editData ? "Update Income" : "Add Income"}
            </button>
          </div>
        </form>

      </div>
    </>
  );
};

export default AddIncome;
