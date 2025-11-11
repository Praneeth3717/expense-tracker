"use client"
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface AddIncomeProps{
  onClose:()=>void
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

const AddIncome:React.FC<AddIncomeProps> = ({ onClose, ReloadData, editData, setEditData, User_Id }) => {

  const [formData, setformData] = useState<FormData>({
    category: "",
    amount: "",
    date: "",
  })

  const HandleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setformData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const FinalData = {
      ...formData,
      amount: Number(formData.amount),
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
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-3">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold text-gray-800">{editData ? "Edit Income" : "Add Income"}</h1>
          <FontAwesomeIcon 
            icon={faTimes} 
            onClick={() => {
              onClose();
              setEditData(null);
            }} 
            className="text-gray-600 cursor-pointer" 
          />
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="mb-1 text-xs text-gray-700 font-medium">Income Source</label>
            <input
              name='category'
              value={formData.category}
              onChange={HandleChange}
              placeholder="Freelance, Salary, etc."
              className="p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 transition text-gray-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-xs text-gray-700 font-medium">Amount</label>
            <input
              name="amount"
              type="number"
              value={formData.amount}
              placeholder='Enter Amount'
              onChange={HandleChange}
              className="p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 transition text-gray-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-xs text-gray-700 font-medium">Date</label>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={HandleChange}
              className="p-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 transition text-gray-500"
              required
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-1"
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