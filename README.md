# Ledger

A personal finance tracker for logging income and spending, seeing where the
money goes each month, and keeping track of debts. You can type transactions in
by hand or import them in bulk from a spreadsheet or a photo of a receipt.

## Features

- **Overview** – income, spending, net and savings-rate totals, a spending-by-
  category donut, a monthly income-vs-spending chart, and a recent activity list.
- **Transactions** – full list of debits (money out) and credits (money in) with
  add and delete. Open it filtered to a single month from the Months page.
- **Months** – one summary row per month (income, spending, net, top category).
  Click any month to drill into just that month's transactions.
- **Import** – upload an `.xlsx` / `.csv` (parsed in the browser) or a receipt
  image (read with Google Gemini). Detected rows land in an editable review
  table so you confirm everything before it's saved.
- **Debts** – track what you owe and what others owe you.
- **Notes** – quick notes and financial goals.
- **Sample data** – one click on an empty dashboard loads a few months of
  realistic transactions to try things out.

Transactions, debts and notes are all stored in MongoDB.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
MongoDB (Mongoose) · Recharts · SheetJS.

## Getting started

Install dependencies:

```bash
npm install
```

Create a `.env.local` in the project root:

```bash
MONGODB_URI=mongodb+srv://...        # required
GEMINI_API_KEY=...                   # optional, enables receipt-image import
GEMINI_MODEL=gemini-flash-latest     # optional, this is the default
```

- `MONGODB_URI` – a MongoDB connection string. A free MongoDB Atlas cluster
  works; so does a local `mongodb://127.0.0.1:27017/ledger`.
- `GEMINI_API_KEY` – a free key from <https://aistudio.google.com/apikey>.
  Without it, spreadsheet import still works and image import shows a
  "not configured" message.

Run the dev server:

```bash
npm run dev
```

Then open <http://localhost:3000>. Env changes are only read at startup, so
restart after editing `.env.local`.

## Importing

**Spreadsheets** are parsed locally. The parser finds the header row even if
there are title/blank rows above it, matches columns by name (date,
description, amount, category, debit/credit), and falls back to detecting
columns by their content when the headers are unfamiliar. Excel date cells are
stored as serial numbers and are converted in UTC, so dates don't drift by a
day across timezones.

**Receipt images** are sent to `POST /api/extract/image`, which asks Gemini to
return the transactions as structured JSON.

Both paths feed the same review table, so nothing is written to the database
until you press save.

## Project layout

```
src/
  app/
    dashboard/        Overview page
    month-detail/     Transactions (supports ?month=YYYY-MM filter)
    month-overview/   Months summary
    import/           Spreadsheet / receipt import
    debt/  notes/     Debts and Notes
    api/              expenses (+ bulk), debts, notes, extract/image
  components/          Sidebar and shared UI (Button, Card, Input, ...)
  lib/                data hooks, formatting, spreadsheet parsing, sample data
  models/             Mongoose schemas
```

## Notes

- `xlsx` (SheetJS) is pinned to the npm build 0.18.5. Newer releases live on
  SheetJS's own CDN if you want the latest security fixes.
