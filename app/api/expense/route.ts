import { NextResponse,NextRequest } from "next/server";
import { getExpenses,AddExpense,deleteExpense, updateExpense } from "../../../controllers/expenseController";
import { ITransaction } from "@/models/transactionModel";
import connectDB from "@/lib/dbConnect";
import mongoose from "mongoose";

export const POST=async(req:NextRequest)=>{
    try {
        await connectDB()
        const body:{
            category:string,
            amount:number,
            date:Date,
            userId:mongoose.Types.ObjectId
        }=await req.json()
        const addedExpense:ITransaction=await AddExpense(body)
        return NextResponse.json(
            {success:true,data:addedExpense},
            {status:201}
        )
    } catch (error) {
        return NextResponse.json(
            {success:false,message:"Failed to add Expense",error}, 
            { status: 500 }
        )
    }
}

export const GET=async(req:NextRequest)=>{
    try {
        await connectDB()
        const userId=req.nextUrl.searchParams.get('userId')
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID is required" }, 
                { status: 400 }
            );
        }
        const ExpensesDashboardData=await getExpenses(userId) 
        return NextResponse.json(
            { success: true, data: ExpensesDashboardData },
            {status:200}
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message:"Failed to get Expenses",error }, 
            { status: 500 }
        )
    }
}

export const DELETE=async(req:NextRequest)=>{
    try {
        await connectDB()
        const id=req.nextUrl.searchParams.get('id')
        if(!id){
            return NextResponse.json(
                { success: false, message: "expense ID is required" }, 
                { status: 400 }
            );
        }
        const deletedExpense=await deleteExpense(id)
        return NextResponse.json(
            { success: true, data: deletedExpense, message: "Income deleted successfully" }, 
            { status: 200 }
        );
    } catch (error) {
        console.error('Error during DELETE operation:', error);
        return NextResponse.json(
            { success: false, message: "Failed to delete expense", error }, 
            { status: 500 }
        );
    }
}

export const PATCH=async(req:NextRequest)=>{
    try {
        await connectDB()
        const id=req.nextUrl.searchParams.get('id')
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Valid Expense ID is required" }, 
                { status: 400 }
            );
        }
        const {category,amount,date}=await req.json()
        const updatedExpense=await updateExpense(id,{category,amount,date})
        if(updatedExpense){
            return NextResponse.json(
                {success:true,data:updatedExpense},
                {status:200}
            )
        }else{
            return NextResponse.json(
                { success: false, message: "Expense not found" }, 
                { status: 404 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to update Expense", error }, 
            { status: 500 }
        );
    }
}