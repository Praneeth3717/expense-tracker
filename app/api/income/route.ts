import { NextRequest, NextResponse } from "next/server";
import { AddIncome,getIncome,deleteIncome,updateIncome } from "../../../controllers/incomeController";
import { ITransaction } from "@/models/transactionModel";
import connectDB from "@/lib/dbConnect";
import mongoose from "mongoose";

export const POST=async(req:NextRequest)=>{
    try {
        await connectDB()
        const body:{
            category:string,
            amount:number,
            date:Date
            userId:mongoose.Types.ObjectId
        }=await req.json()

        const addedIncome:ITransaction=await AddIncome(body)

        return NextResponse.json(
            {success:true,data:addedIncome},
            {status:201}
        )
    } catch (error) {
        return NextResponse.json(
            {success:false,message:"Failed to add Income",error}, 
            { status: 500 }
        )
    }
}

export const GET=async(req:NextRequest)=>{
    try {
        await connectDB();
        const userId=req.nextUrl.searchParams.get('userId')

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID is required" }, 
                { status: 400 }
            );
        }
        const IncomeDashboardData=await getIncome(userId) 
        return NextResponse.json(
            { success: true, data: IncomeDashboardData },
            {status:200}
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message:"Failed to get Income",error }, 
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
                { success: false, message: "Income ID is required" }, 
                { status: 400 }
            );
        }
        const deletedIncome=await deleteIncome(id)
        return NextResponse.json(
            { success: true, data: deletedIncome, message: "Income deleted successfully" }, 
            { status: 200 }
        );
    } catch (error) {
        console.error('Error during DELETE operation:', error);
        return NextResponse.json(
            { success: false, message: "Failed to delete Income", error }, 
            { status: 500 }
        );
    }
}

export const PATCH=async(req:NextRequest)=>{
    try {
        await connectDB();

        const id=req.nextUrl.searchParams.get('id'

        )
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Valid Income ID is required" }, 
                { status: 400 }
            );
        }

        const {category, amount, date } = await req.json();
        const updatedIncome = await updateIncome(id, { category, amount, date });
        if (updatedIncome) {
            return NextResponse.json(
                { success: true, data: updatedIncome }, 
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { success: false, message: "Income not found" }, 
                { status: 404 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to update Income", error }, 
            { status: 500 }
        );
    }
}