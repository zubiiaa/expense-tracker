import type { TransactionType } from "@/lib/categories";

type SampleRow = {
  expense_name: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
};

// one month of typical activity, repeated across recent months for the demo
const TEMPLATE: Array<Omit<SampleRow, "date">> = [
  { expense_name: "Monthly salary", amount: 4200, category: "Income", type: "credit" },
  { expense_name: "Rent", amount: 1450, category: "Housing", type: "debit" },
  { expense_name: "Whole Foods", amount: 186.4, category: "Groceries", type: "debit" },
  { expense_name: "Trader Joe's", amount: 92.15, category: "Groceries", type: "debit" },
  { expense_name: "Electric bill", amount: 88.2, category: "Bills", type: "debit" },
  { expense_name: "Internet", amount: 60, category: "Bills", type: "debit" },
  { expense_name: "Phone plan", amount: 45, category: "Bills", type: "debit" },
  { expense_name: "Uber", amount: 23.5, category: "Transport", type: "debit" },
  { expense_name: "Gas station", amount: 54.8, category: "Transport", type: "debit" },
  { expense_name: "Netflix", amount: 15.49, category: "Entertainment", type: "debit" },
  { expense_name: "Spotify", amount: 11.99, category: "Entertainment", type: "debit" },
  { expense_name: "Dinner out", amount: 68.0, category: "Food", type: "debit" },
  { expense_name: "Coffee", amount: 18.75, category: "Food", type: "debit" },
  { expense_name: "Amazon order", amount: 74.3, category: "Shopping", type: "debit" },
  { expense_name: "Pharmacy", amount: 32.1, category: "Health", type: "debit" },
  { expense_name: "Freelance project", amount: 650, category: "Income", type: "credit" },
];

// ~3 months of sample transactions up to the current month
export function generateSampleTransactions(): SampleRow[] {
  const now = new Date();
  const rows: SampleRow[] = [];

  for (let monthsAgo = 2; monthsAgo >= 0; monthsAgo--) {
    TEMPLATE.forEach((item, i) => {
      const day = ((i * 2) % 27) + 1;
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - monthsAgo,
        day,
      );
      // vary amounts a bit per month so the trend isn't flat
      const drift = 1 + ((i % 3) - 1) * 0.05 * monthsAgo;
      rows.push({
        ...item,
        amount: Math.round(item.amount * drift * 100) / 100,
        date: date.toISOString().slice(0, 10),
      });
    });
  }

  return rows;
}
