import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Expense from "@/models/Expense";

type IncomingRow = {
  date?: string;
  expense_name?: string;
  category?: string;
  amount?: number | string;
  type?: string;
};

// insert many transactions at once (used by import)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rows: IncomingRow[] = Array.isArray(body?.rows) ? body.rows : [];

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "No transactions provided" },
        { status: 400 },
      );
    }

    const docs = rows
      .filter((row) => row.expense_name && row.amount !== undefined)
      .map((row) => ({
        date: row.date ? new Date(row.date) : new Date(),
        expense_name: String(row.expense_name).slice(0, 100),
        category: String(row.category || "Other").slice(0, 50),
        amount: Math.abs(Number(row.amount)) || 0,
        type: row.type === "credit" ? "credit" : "debit",
      }));

    if (docs.length === 0) {
      return NextResponse.json(
        { error: "No valid transactions to import" },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const inserted = await Expense.insertMany(docs);

    return NextResponse.json(
      { success: true, count: inserted.length, data: inserted },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error bulk-inserting expenses:", error);
    return NextResponse.json(
      { error: "Failed to import transactions" },
      { status: 500 },
    );
  }
}
