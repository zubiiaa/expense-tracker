import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Note from "@/models/Note";

export async function GET() {
  try {
    await connectToDatabase();
    const notes = await Note.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, category, content, date } = await request.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    await connectToDatabase();
    const note = await Note.create({
      title,
      category: category || "Personal",
      content: content || "",
      date: date || new Date(),
    });
    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch (error) {
    console.error("Error adding note:", error);
    return NextResponse.json({ error: "Failed to add note" }, { status: 500 });
  }
}
