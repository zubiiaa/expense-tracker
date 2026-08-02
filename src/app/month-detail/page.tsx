"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Select,
} from "@/components/ui";
import { CATEGORIES, type TransactionType } from "@/lib/categories";
import { formatCurrency, formatDate } from "@/lib/format";
import { useExpenses, type Transaction } from "@/lib/useExpenses";

function monthKeyOf(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function TransactionsView() {
  const { transactions, loading, add, remove } = useExpenses();
  const monthFilter = useSearchParams().get("month");

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [type, setType] = useState<TransactionType>("debit");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      monthFilter
        ? transactions.filter((t) => monthKeyOf(t.date) === monthFilter)
        : transactions,
    [transactions, monthFilter],
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;
    setSubmitting(true);
    setError(null);
    try {
      await add({
        expense_name: name,
        date: date || undefined,
        amount: Number(amount),
        category,
        type,
      });
      setName("");
      setDate("");
      setAmount("");
      setType("debit");
      setCategory(CATEGORIES[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Transactions"
        description={
          monthFilter
            ? `Showing ${monthLabel(monthFilter)} only.`
            : "Every recorded debit and credit."
        }
        actions={
          monthFilter ? (
            <Link href="/month-overview">
              <Button variant="secondary">Show all months</Button>
            </Link>
          ) : undefined
        }
      />

      {monthFilter ? (
        <div className="mb-4 flex items-center gap-2 text-sm text-muted">
          <span>Filtered:</span>
          <Badge>{monthLabel(monthFilter)}</Badge>
        </div>
      ) : null}

      <Card className="mb-6">
        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-end"
        >
          <div className="lg:col-span-2">
            <Field label="Name" htmlFor="tx-name">
              <Input
                id="tx-name"
                placeholder="e.g. Groceries"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Date" htmlFor="tx-date">
            <Input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label="Amount" htmlFor="tx-amount">
            <Input
              id="tx-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Field>
          <Field label="Category" htmlFor="tx-category">
            <Select
              id="tx-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Type" htmlFor="tx-type">
            <Select
              id="tx-type"
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
            >
              <option value="debit">Debit (out)</option>
              <option value="credit">Credit (in)</option>
            </Select>
          </Field>
          <div className="lg:col-span-6">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding…" : "Add transaction"}
            </Button>
            {error ? (
              <span className="ml-3 text-sm text-negative">{error}</span>
            ) : null}
          </div>
        </form>
      </Card>

      <Card className="p-0">
        {loading ? (
          <p className="p-5 text-sm text-muted">Loading…</p>
        ) : visible.length === 0 ? (
          <p className="p-5 text-sm text-muted">
            {monthFilter
              ? "No transactions in this month."
              : "No transactions yet. Add one above or import a file."}
          </p>
        ) : (
          <TransactionTable transactions={visible} onDelete={remove} />
        )}
      </Card>
    </div>
  );
}

function TransactionTable({
  transactions,
  onDelete,
}: {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Date</th>
            <th className="px-5 py-3 font-medium">Category</th>
            <th className="px-5 py-3 text-right font-medium">Amount</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id} className="border-b border-border last:border-0">
              <td className="px-5 py-3 font-medium">{t.expense_name}</td>
              <td className="px-5 py-3 text-muted">{formatDate(t.date)}</td>
              <td className="px-5 py-3">
                <Badge>{t.category}</Badge>
              </td>
              <td
                className={`px-5 py-3 text-right font-medium tabular-nums ${
                  t.type === "credit" ? "text-positive" : "text-foreground"
                }`}
              >
                {t.type === "credit" ? "+" : "−"}
                {formatCurrency(t.amount)}
              </td>
              <td className="px-5 py-3 text-right">
                <button
                  onClick={() => onDelete(t._id)}
                  className="text-muted transition-colors hover:text-negative"
                  title="Delete"
                  aria-label={`Delete ${t.expense_name}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    className="h-4 w-4"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Transactions() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
      <TransactionsView />
    </Suspense>
  );
}
