import { NextRequest, NextResponse } from "next/server";
import {
  AddIncome,
  getIncome,
  deleteIncome,
  updateIncome,
} from "../../../controllers/incomeController";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const addedIncome = await AddIncome(body);

    return NextResponse.json(
      { success: true, data: addedIncome },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add Income", error },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const incomeDashboardData = await getIncome(Number(userId));

    return NextResponse.json(
      { success: true, data: incomeDashboardData },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to get Income", error },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Income ID is required" },
        { status: 400 }
      );
    }

    const deletedIncome = await deleteIncome(Number(id));

    return NextResponse.json(
      {
        success: true,
        data: deletedIncome,
        message: "Income deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete Income", error },
      { status: 500 }
    );
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Income ID is required" },
        { status: 400 }
      );
    }

    const { category, amount, transactionDate } = await req.json();

    const updatedIncome = await updateIncome(Number(id), {
      category,
      amount,
      transactionDate,
    });

    return NextResponse.json(
      { success: true, data: updatedIncome },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update Income", error },
      { status: 500 }
    );
  }
};