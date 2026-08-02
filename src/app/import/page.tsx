"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  Button,
  Card,
  Input,
  PageHeader,
  Select,
} from "@/components/ui";
import { CATEGORIES, type TransactionType } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import { parseSheetRows, type DraftRow } from "@/lib/parseSpreadsheet";

const SHEET_EXT = /\.(xlsx|xls|csv)$/i;
const IMAGE_EXT = /\.(png|jpe?g|webp|heic|gif)$/i;

export default function ImportPage() {
  const [rows, setRows] = useState<DraftRow[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setStatus(null);
    setSaved(null);
    setBusy(true);
    try {
      if (SHEET_EXT.test(file.name)) {
        const XLSX = await import("xlsx");
        const buffer = await file.arrayBuffer();
        // keep raw serials and convert them, otherwise SheetJS
        // shifts dates by a day in local timezones
        const wb = XLSX.read(buffer, { type: "array", cellDates: false });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
          header: 1,
          blankrows: false,
          defval: "",
        });
        const mapped = parseSheetRows(aoa);
        setRows(mapped);
        setStatus(
          mapped.length
            ? `Found ${mapped.length} rows. Review and edit before saving.`
            : "Couldn't find transaction rows. Make sure the sheet has columns for a name/description and an amount.",
        );
      } else if (IMAGE_EXT.test(file.name) || file.type.startsWith("image/")) {
        setStatus("Extracting your image, back in a minute...");
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/extract/image", {
          method: "POST",
          body: form,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Extraction failed");
        const mapped: DraftRow[] = (json.rows as Record<string, unknown>[]).map(
          (r, i) => ({
            id: `img-${i}`,
            expense_name: String(r.expense_name ?? "").trim(),
            date: r.date ? String(r.date).slice(0, 10) : "",
            amount: Math.abs(Number(r.amount)) || 0,
            category: (CATEGORIES as readonly string[]).includes(
              String(r.category),
            )
              ? String(r.category)
              : "Other",
            type: r.type === "credit" ? "credit" : "debit",
          }),
        );
        setRows(mapped);
        setStatus(
          mapped.length
            ? `Detected ${mapped.length} transactions. Review before saving.`
            : "Couldn't read any transactions from that image.",
        );
      } else {
        setStatus("Unsupported file. Use .xlsx, .csv, or an image.");
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const update = (id: string, patch: Partial<DraftRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const removeRow = (id: string) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  const save = async () => {
    const valid = rows.filter((r) => r.expense_name && r.amount > 0);
    if (valid.length === 0) {
      setStatus("Nothing to save — each row needs a name and amount.");
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/expenses/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: valid.map((r) => ({
            expense_name: r.expense_name,
            date: r.date || undefined,
            amount: r.amount,
            category: r.category,
            type: r.type,
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to import");
      setSaved(json.count);
      setRows([]);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to import.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Import"
        description="Upload a spreadsheet or a photo of a receipt. Fields are detected automatically — you confirm before anything is saved."
      />

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center transition-colors ${
          dragOver
            ? "border-accent bg-surface-muted"
            : "border-border bg-surface hover:bg-surface-muted"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-8 w-8 text-muted"
        >
          <path d="M12 16V4M7 9l5-5 5 5" />
          <path d="M5 20h14" />
        </svg>
        <span className="text-sm font-medium">
          {busy ? "Processing…" : "Drop a file here, or click to browse"}
        </span>
        <span className="text-xs text-muted">
          Spreadsheet (.xlsx, .csv) or receipt image (.png, .jpg)
        </span>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv,image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </label>

      {status ? (
        <p className="mt-4 text-sm text-muted">{status}</p>
      ) : null}

      {saved !== null ? (
        <Card className="mt-4 flex items-center justify-between">
          <span className="text-sm">
            Imported {saved} transaction{saved === 1 ? "" : "s"}.
          </span>
          <Link href="/month-detail">
            <Button variant="secondary">View transactions</Button>
          </Link>
        </Card>
      ) : null}

      {rows.length > 0 ? (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted">
              Review {rows.length} transaction{rows.length === 1 ? "" : "s"}
            </h2>
            <Button onClick={save} disabled={busy}>
              {busy ? "Saving…" : `Save ${rows.length}`}
            </Button>
          </div>
          <Card className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 text-right font-medium">Amount</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-2">
                        <Input
                          value={r.expense_name}
                          onChange={(e) =>
                            update(r.id, { expense_name: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="date"
                          value={r.date}
                          onChange={(e) =>
                            update(r.id, { date: e.target.value })
                          }
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={r.category}
                          onChange={(e) =>
                            update(r.id, { category: e.target.value })
                          }
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={r.type}
                          onChange={(e) =>
                            update(r.id, {
                              type: e.target.value as TransactionType,
                            })
                          }
                        >
                          <option value="debit">Debit</option>
                          <option value="credit">Credit</option>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          step="0.01"
                          className="text-right"
                          value={r.amount}
                          onChange={(e) =>
                            update(r.id, { amount: Number(e.target.value) })
                          }
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => removeRow(r.id)}
                          className="text-muted transition-colors hover:text-negative"
                          aria-label="Remove row"
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
                <tfoot>
                  <tr className="border-t border-border">
                    <td colSpan={4} className="px-4 py-3 text-muted">
                      Total
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {formatCurrency(
                        rows.reduce((s, r) => s + (r.amount || 0), 0),
                      )}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
