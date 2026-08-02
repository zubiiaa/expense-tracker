export const CATEGORIES = [
  "Food",
  "Groceries",
  "Transport",
  "Housing",
  "Bills",
  "Shopping",
  "Health",
  "Entertainment",
  "Travel",
  "Income",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export type TransactionType = "debit" | "credit";
