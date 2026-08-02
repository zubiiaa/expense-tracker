import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Debt from "@/models/Debt";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid debt ID" }, { status: 400 });
    }
    await connectToDatabase();
    const deleted = await Debt.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Debt not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error("Error deleting debt:", error);
    return NextResponse.json({ error: "Failed to delete debt" }, { status: 500 });
  }
}
