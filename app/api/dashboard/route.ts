import { NextRequest, NextResponse } from "next/server";
import { getDashboardData } from "../../../controllers/dashboardController";
import { use } from "react";

export const GET = async (req: NextRequest) => {
  try {
    const userIdParam = req.nextUrl.searchParams.get("userId");
    const userId = Number(userIdParam);

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const dashboardData = await getDashboardData(Number(userId));

    return NextResponse.json(
      {
        success: true,
        data: dashboardData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get Dashboard Data",
      },
      { status: 500 }
    );
  }
};