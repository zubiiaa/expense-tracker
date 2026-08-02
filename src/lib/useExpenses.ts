"use client";

import { useCallback, useEffect, useState } from "react";
import type { TransactionType } from "@/lib/categories";

export type Transaction = {
  _id: string;
  date: string;
  expense_name: string;
  category: string;
  amount: number;
  type: TransactionType;
};

export type NewTransaction = {
  date?: string;
  expense_name: string;
  category: string;
  amount: number;
  type: TransactionType;
};

export function useExpenses() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/expenses");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load");
      setTransactions(json.data as Transaction[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(async (tx: NewTransaction) => {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tx),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to add");
    setTransactions((prev) => [json.data as Transaction, ...prev]);
  }, []);

  const remove = useCallback(async (id: string) => {
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error || "Failed to delete");
    }
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  }, []);

  return { transactions, loading, error, reload: load, add, remove };
}
