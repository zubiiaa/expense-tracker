import { NextRequest, NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/categories";

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

const RESPONSE_SCHEMA = {
  type: "array",
  items: {
    type: "object",
    properties: {
      expense_name: { type: "string" },
      date: { type: "string", description: "ISO date, YYYY-MM-DD" },
      amount: { type: "number" },
      category: { type: "string", enum: [...CATEGORIES] },
      type: { type: "string", enum: ["debit", "credit"] },
    },
    required: ["expense_name", "amount", "type"],
  },
};

const PROMPT = `You are a finance assistant extracting transactions from an image (a receipt, bank statement, or screenshot).
Return every distinct transaction you can read. For each one:
- expense_name: a short merchant or item label.
- date: the transaction date as YYYY-MM-DD. Omit if not visible.
- amount: a positive number, no currency symbol.
- category: pick the closest from ${CATEGORIES.join(", ")}.
- type: "credit" for money received/refunds/deposits, "debit" for money spent.
Ignore subtotals, taxes, and running balances unless they are the only line. If nothing is readable, return an empty array.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Image extraction is not configured. Add GEMINI_API_KEY to .env.local (free key from aistudio.google.com).",
      },
      { status: 501 },
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: PROMPT },
                {
                  inline_data: {
                    mime_type: file.type || "image/png",
                    data: base64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
          },
        }),
      },
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error("Gemini error:", detail);
      return NextResponse.json(
        { error: "The extraction service returned an error." },
        { status: 502 },
      );
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

    let rows: unknown;
    try {
      rows = JSON.parse(text);
    } catch {
      rows = [];
    }

    return NextResponse.json({ success: true, rows: Array.isArray(rows) ? rows : [] });
  } catch (error) {
    console.error("Error extracting image:", error);
    return NextResponse.json(
      { error: "Failed to read the image" },
      { status: 500 },
    );
  }
}
