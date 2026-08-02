"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Badge, Card, PageHeader } from "@/components/ui";
import { formatCurrency } from "@/lib/format";
import { useExpenses, type Transaction } from "@/lib/useExpenses";

type MonthSummary = {
  key: string;
  label: string;
  income: number;
  spending: number;
  net: number;
  count: number;
  topCategory: { name: string; amount: number } | null;
};

function summarize(transactions: Transaction[]): MonthSummary[] {
  const months = new Map<string, Transaction[]>();
  for (const t of transactions) {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const bucket = months.get(key);
    if (bucket) bucket.push(t);
    else months.set(key, [t]);
  }

  return [...months.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, rows]) => {
      const income = rows
        .filter((r) => r.type === "credit")
        .reduce((s, r) => s + r.amount, 0);
      const spending = rows
        .filter((r) => r.type === "debit")
        .reduce((s, r) => s + r.amount, 0);

      const byCategory = new Map<string, number>();
      for (const r of rows) {
        if (r.type !== "debit") continue;
        byCategory.set(r.category, (byCategory.get(r.category) ?? 0) + r.amount);
      }
      const top = [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0];

      return {
        key,
        label: new Date(`${key}-01`).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        income,
        spending,
        net: income - spending,
        count: rows.length,
        topCategory: top ? { name: top[0], amount: top[1] } : null,
      };
    });
}

export default function MonthOverview() {
  const { transactions, loading } = useExpenses();
  const summaries = useMemo(() => summarize(transactions), [transactions]);

  return (
    <div>
      <PageHeader
        title="Months"
        description="Income, spending, and net saved for each month."
      />

      {loading ? (
        <Card className="text-sm text-muted">Loading…</Card>
      ) : summaries.length === 0 ? (
        <Card className="text-sm text-muted">
          No data yet. Add or import transactions to see monthly summaries.
        </Card>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {summaries.slice(0, 3).map((m) => (
              <Link key={m.key} href={`/month-detail?month=${m.key}`}>
                <Card className="flex h-full flex-col gap-3 transition-colors hover:border-muted hover:bg-surface-muted">
                <span className="text-sm font-medium">{m.label}</span>
                <dl className="flex flex-col gap-1 text-sm">
                  <Row label="Income" value={formatCurrency(m.income)} tone="positive" />
                  <Row label="Spending" value={formatCurrency(m.spending)} tone="negative" />
                  <Row
                    label="Net"
                    value={formatCurrency(m.net)}
                    tone={m.net >= 0 ? "positive" : "negative"}
                  />
                  <Row label="Transactions" value={String(m.count)} />
                </dl>
                </Card>
              </Link>
            ))}
          </div>

          <Card className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                    <th className="px-5 py-3 font-medium">Month</th>
                    <th className="px-5 py-3 text-right font-medium">Income</th>
                    <th className="px-5 py-3 text-right font-medium">Spending</th>
                    <th className="px-5 py-3 text-right font-medium">Net</th>
                    <th className="px-5 py-3 font-medium">Top category</th>
                  </tr>
                </thead>
                <tbody>
                  {summaries.map((m) => (
                    <tr
                      key={m.key}
                      className="border-b border-border last:border-0 transition-colors hover:bg-surface-muted"
                    >
                      <td className="px-5 py-3 font-medium">
                        <Link
                          href={`/month-detail?month=${m.key}`}
                          className="underline-offset-4 hover:underline"
                        >
                          {m.label}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-positive">
                        {formatCurrency(m.income)}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-negative">
                        {formatCurrency(m.spending)}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">
                        {formatCurrency(m.net)}
                      </td>
                      <td className="px-5 py-3">
                        {m.topCategory ? (
                          <Badge>
                            {m.topCategory.name} · {formatCurrency(m.topCategory.amount)}
                          </Badge>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "text-positive"
      : tone === "negative"
        ? "text-negative"
        : "text-foreground";
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className={`font-medium tabular-nums ${toneClass}`}>{value}</dd>
    </div>
  );
}
