"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Badge, Button, Card, PageHeader, StatCard } from "@/components/ui";
import { CHART_COLORS } from "@/lib/categories";
import { formatCurrency, formatDate } from "@/lib/format";
import { generateSampleTransactions } from "@/lib/sampleData";
import { useExpenses, type Transaction } from "@/lib/useExpenses";

function categoryBreakdown(transactions: Transaction[]) {
  const totals = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "debit") continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }
  return [...totals.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function monthlyTotals(transactions: Transaction[]) {
  const buckets = new Map<string, { income: number; spending: number }>();
  for (const t of transactions) {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const bucket = buckets.get(key) ?? { income: 0, spending: 0 };
    if (t.type === "credit") bucket.income += t.amount;
    else bucket.spending += t.amount;
    buckets.set(key, bucket);
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, v]) => ({
      month: new Date(`${key}-01`).toLocaleDateString("en-US", {
        month: "short",
      }),
      ...v,
    }));
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-sm">
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span className="text-muted">{p.name}</span>
          <span className="font-medium tabular-nums">
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { transactions, loading, reload } = useExpenses();
  const [seeding, setSeeding] = useState(false);

  const { income, spending, net, savingsRate, categories, monthly, recent } =
    useMemo(() => {
      const income = transactions
        .filter((t) => t.type === "credit")
        .reduce((s, t) => s + t.amount, 0);
      const spending = transactions
        .filter((t) => t.type === "debit")
        .reduce((s, t) => s + t.amount, 0);
      const net = income - spending;
      return {
        income,
        spending,
        net,
        savingsRate: income > 0 ? Math.round((net / income) * 100) : 0,
        categories: categoryBreakdown(transactions),
        monthly: monthlyTotals(transactions),
        recent: transactions.slice(0, 5),
      };
    }, [transactions]);

  const loadSample = async () => {
    setSeeding(true);
    try {
      await fetch("/api/expenses/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: generateSampleTransactions() }),
      });
      await reload();
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Overview"
        description="A snapshot of your income, spending, and where the money goes."
        actions={
          <Link href="/import">
            <Button variant="secondary">Import</Button>
          </Link>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Income" value={formatCurrency(income)} tone="positive" />
        <StatCard
          label="Spending"
          value={formatCurrency(spending)}
          tone="negative"
        />
        <StatCard
          label="Net"
          value={formatCurrency(net)}
          tone={net >= 0 ? "positive" : "negative"}
        />
        <StatCard
          label="Savings rate"
          value={`${savingsRate}%`}
          hint={`${transactions.length} transactions`}
        />
      </div>

      {loading ? (
        <Card className="text-sm text-muted">Loading…</Card>
      ) : transactions.length === 0 ? (
        <Card className="flex flex-col items-start gap-3">
          <div>
            <p className="font-medium">No transactions yet</p>
            <p className="text-sm text-muted">
              Load a set of sample data to explore the app, or add your own.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={loadSample} disabled={seeding}>
              {seeding ? "Loading…" : "Load sample data"}
            </Button>
            <Link href="/month-detail">
              <Button variant="secondary">Add manually</Button>
            </Link>
            <Link href="/import">
              <Button variant="secondary">Import</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="mb-4 text-sm font-medium text-muted">
                Spending by category
              </h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {categories.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {categories.map((cat, i) => (
                  <div
                    key={cat.name}
                    className="flex items-center gap-2 text-xs text-muted"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        background: CHART_COLORS[i % CHART_COLORS.length],
                      }}
                    />
                    {cat.name}
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-sm font-medium text-muted">
                Income vs. spending
              </h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthly} barGap={6}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--muted)", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={40}
                    tick={{ fill: "var(--muted)", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--surface-2)" }}
                    content={<ChartTooltip />}
                  />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="var(--positive)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="spending"
                    name="Spending"
                    fill="var(--negative)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-0">
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-sm font-medium text-muted">
                Recent transactions
              </h2>
              <Link
                href="/month-detail"
                className="text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="border-t border-border">
              {recent.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center justify-between border-b border-border px-5 py-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {t.expense_name}
                    </span>
                    <Badge>{t.category}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted">
                      {formatDate(t.date)}
                    </span>
                    <span
                      className={`text-sm font-medium tabular-nums ${
                        t.type === "credit"
                          ? "text-positive"
                          : "text-foreground"
                      }`}
                    >
                      {t.type === "credit" ? "+" : "−"}
                      {formatCurrency(t.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
