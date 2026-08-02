import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Debt from "@/models/Debt";

export async function GET() {
  try {
    await connectToDatabase();
    const debts = await Debt.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: debts });
  } catch (error) {
    console.error("Error fetching debts:", error);
    return NextResponse.json({ error: "Failed to fetch debts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, amount, detail, date, direction } = await request.json();
    if (!name || amount === undefined || amount === null) {
      return NextResponse.json(
        { error: "Name and amount are required" },
        { status: 400 },
      );
    }
    await connectToDatabase();
    const debt = await Debt.create({
      name,
      amount: Math.abs(Number(amount)) || 0,
      detail: detail || "",
      date: date || new Date(),
      direction: direction === "owed" ? "owed" : "owe",
    });
    return NextResponse.json({ success: true, data: debt }, { status: 201 });
  } catch (error) {
    console.error("Error adding debt:", error);
    return NextResponse.json({ error: "Failed to add debt" }, { status: 500 });
  }
}
