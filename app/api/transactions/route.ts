import { NextRequest, NextResponse } from "next/server";
import { getDashboardData } from '../../../controllers/transactionController'
import connectDB from "@/app/lib/dbConnect";

export const GET=async(req:NextRequest)=>{
    try {
        await connectDB()
        const User_Id=req.nextUrl.searchParams.get('userId')
        if (!User_Id) {
            return NextResponse.json({ 
                success: false, 
                message: "User ID is required" 
            }, { status: 400 });
        }
        const DashboardData = await getDashboardData(User_Id);

        return NextResponse.json({ 
            success: true, 
            data: DashboardData 
        },{status:200});

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message:"Failed to get Dashboard Data",
            error:error instanceof Error ? error.message:"Unknown Error"
        }, { status: 500 })
    }
}