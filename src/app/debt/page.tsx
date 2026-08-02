"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  StatCard,
} from "@/components/ui";
import { cn, formatCurrency, formatDate } from "@/lib/format";
import { useCollection } from "@/lib/useCollection";

type Direction = "owe" | "owed";

type Debt = {
  _id: string;
  name: string;
  amount: number;
  detail: string;
  date: string;
  direction: Direction;
};

export default function DebtTracker() {
  const { items: debts, loading, add, remove } = useCollection<Debt>("/api/debts");
  const [tab, setTab] = useState<Direction>("owe");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [detail, setDetail] = useState("");
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const owe = debts.filter((d) => d.direction === "owe");
  const owed = debts.filter((d) => d.direction === "owed");
  const totalOwe = owe.reduce((s, d) => s + d.amount, 0);
  const totalOwed = owed.reduce((s, d) => s + d.amount, 0);
  const records = tab === "owe" ? owe : owed;

  const handleAdd = async (direction: Direction) => {
    if (!name || !amount) return;
    setBusy(true);
    setError(null);
    try {
      await add({ name, amount: Number(amount), detail, date: date || undefined, direction });
      setName("");
      setAmount("");
      setDetail("");
      setDate("");
      setTab(direction);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Debts"
        description="Money you owe and money owed to you."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="You owe" value={formatCurrency(totalOwe)} tone="negative" />
        <StatCard label="Owed to you" value={formatCurrency(totalOwed)} tone="positive" />
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Name" htmlFor="d-name">
            <Input
              id="d-name"
              placeholder="Person's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Amount" htmlFor="d-amount">
            <Input
              id="d-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Field>
          <Field label="Detail" htmlFor="d-detail">
            <Input
              id="d-detail"
              placeholder="What for?"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </Field>
          <Field label="Date" htmlFor="d-date">
            <Input
              id="d-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Button onClick={() => handleAdd("owe")} disabled={busy}>
            I owe this
          </Button>
          <Button variant="secondary" onClick={() => handleAdd("owed")} disabled={busy}>
            They owe me
          </Button>
          {error ? <span className="text-sm text-negative">{error}</span> : null}
        </div>
      </Card>

      <div className="mb-4 inline-flex rounded-lg border border-border bg-surface p-1">
        {(["owe", "owed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t
                ? "bg-accent text-accent-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            {t === "owe"
              ? `I owe (${owe.length})`
              : `Owed to me (${owed.length})`}
          </button>
        ))}
      </div>

      <Card className="p-0">
        {loading ? (
          <p className="p-5 text-sm text-muted">Loading…</p>
        ) : records.length === 0 ? (
          <p className="p-5 text-sm text-muted">Nothing recorded here yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Detail</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {records.map((d) => (
                  <tr key={d._id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium">{d.name}</td>
                    <td className="px-5 py-3 text-muted">{d.detail || "—"}</td>
                    <td className="px-5 py-3 text-muted">
                      {d.date ? formatDate(d.date) : "—"}
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums">
                      {formatCurrency(d.amount)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => remove(d._id)}
                        className="text-muted transition-colors hover:text-negative"
                        aria-label="Delete"
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
        )}
      </Card>
    </div>
  );
}
