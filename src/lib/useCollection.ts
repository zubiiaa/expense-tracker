"use client";

import { useCallback, useEffect, useState } from "react";

type WithId = { _id: string };

// small fetch-backed list: loads on mount, add prepends, remove deletes
export function useCollection<T extends WithId>(endpoint: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load");
      setItems(json.data as T[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(
    async (payload: Record<string, unknown>) => {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to add");
      setItems((prev) => [json.data as T, ...prev]);
    },
    [endpoint],
  );

  const remove = useCallback(
    async (id: string) => {
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to delete");
      }
      setItems((prev) => prev.filter((i) => i._id !== id));
    },
    [endpoint],
  );

  return { items, loading, error, reload: load, add, remove };
}
