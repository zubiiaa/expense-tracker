import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Expense from "@/models/Expense";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, expense_name, category, amount, type } = body;

    if (!expense_name || !category || amount === undefined || amount === null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const expense = await Expense.create({
      date: date || new Date(),
      expense_name,
      category,
      amount: Number(amount),
      type: type === "credit" ? "credit" : "debit",
    });

    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error) {
    console.error("Error adding expense:", error);
    return NextResponse.json(
      { error: "Failed to add expense" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const expenses = await Expense.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 },
    );
  }
}
