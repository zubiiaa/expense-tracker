import { CATEGORIES, type TransactionType } from "@/lib/categories";

export type DraftRow = {
  id: string;
  expense_name: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
};

// cell helpers

function isBlank(v: unknown): boolean {
  return v === null || v === undefined || String(v).trim() === "";
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  const cleaned = String(value ?? "").replace(/[^0-9.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function looksNumeric(v: unknown): boolean {
  if (typeof v === "number") return true;
  const s = String(v ?? "").trim();
  return /\d/.test(s) && /^[-+]?[\d.,$€£\s]+$/.test(s);
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

// excel serial 25569 = 1970-01-01. convert in utc so the timezone can't shift the day
const EXCEL_EPOCH_DAYS = 25569;
// serial range for roughly 2000-2060
const SERIAL_MIN = 36526;
const SERIAL_MAX = 58500;

function excelSerialToISODate(serial: number): string {
  const ms = (serial - EXCEL_EPOCH_DAYS) * 86400 * 1000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

function toISODate(value: unknown): string {
  // excel serial number
  if (typeof value === "number" && Number.isFinite(value)) {
    return excelSerialToISODate(value);
  }

  const raw = String(value ?? "").trim();

  // already iso, leave it as is
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  // bare int in the serial range is almost always a serial
  if (/^\d+$/.test(raw)) {
    const n = Number(raw);
    if (n >= SERIAL_MIN && n <= SERIAL_MAX) return excelSerialToISODate(n);
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${value.getUTCFullYear()}-${pad2(value.getUTCMonth() + 1)}-${pad2(value.getUTCDate())}`;
  }

  if (!raw) return "";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "";
  return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())}`;
}

function looksDate(v: unknown): boolean {
  if (v instanceof Date) return !Number.isNaN(v.getTime());
  // serial-range number, probably a date column with no header
  if (typeof v === "number") return v >= SERIAL_MIN && v <= SERIAL_MAX;
  const s = String(v ?? "").trim();
  if (!s) return false;
  if (looksNumericPure(s)) {
    const n = Number(s);
    return n >= SERIAL_MIN && n <= SERIAL_MAX;
  }
  return (
    /[\/.-]/.test(s) || /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(s)
  ) && !Number.isNaN(new Date(s).getTime());
}

function looksNumericPure(s: string): boolean {
  return /^[-+]?\d+(\.\d+)?$/.test(s.trim());
}

function normalizeCategory(value: unknown): string {
  const text = String(value ?? "").trim();
  const match = CATEGORIES.find((c) => c.toLowerCase() === text.toLowerCase());
  return match ?? "Other";
}

// header + column detection

const HEADER_HINT =
  /name|desc|merchant|payee|detail|item|narration|memo|date|posted|amount|value|total|price|category|type|debit|credit|withdrawal|deposit|balance/i;

// find the header row, skipping any title/blank rows above it
function findHeaderRow(aoa: unknown[][]): number {
  const limit = Math.min(aoa.length, 15);
  let best = -1;
  let bestScore = 0;
  for (let i = 0; i < limit; i++) {
    const row = aoa[i] ?? [];
    const score = row.filter(
      (c) => typeof c === "string" && HEADER_HINT.test(c),
    ).length;
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return best;
}

function matchColumn(headers: string[], pattern: RegExp): number {
  return headers.findIndex((h) => pattern.test(h));
}

// fall back to finding a column by its content when the header name didn't match
function pickByContent(
  rows: unknown[][],
  predicate: (v: unknown) => boolean,
  exclude: Set<number>,
  width: number,
): number {
  let best = -1;
  let bestHits = 0;
  for (let c = 0; c < width; c++) {
    if (exclude.has(c)) continue;
    let hits = 0;
    for (const row of rows) if (predicate(row[c])) hits++;
    if (hits > bestHits) {
      bestHits = hits;
      best = c;
    }
  }
  return bestHits > 0 ? best : -1;
}

// turn raw sheet rows into draft transactions: find the header, map columns by
// name, and guess by content when the names are unfamiliar
export function parseSheetRows(aoa: unknown[][]): DraftRow[] {
  const grid = aoa.filter((r) => Array.isArray(r) && r.some((c) => !isBlank(c)));
  if (grid.length === 0) return [];

  const headerIdx = findHeaderRow(grid);
  const hasHeader = headerIdx >= 0;
  const headers = hasHeader
    ? (grid[headerIdx] ?? []).map((h) => String(h ?? ""))
    : [];
  const dataRows = grid
    .slice(hasHeader ? headerIdx + 1 : 0)
    .filter((r) => r.some((c) => !isBlank(c)));
  if (dataRows.length === 0) return [];

  const width = Math.max(
    headers.length,
    ...dataRows.map((r) => r.length),
  );

  // try header name first, then content-based fallback
  let nameCol = hasHeader
    ? matchColumn(headers, /name|desc|merchant|payee|detail|item|narration|memo/i)
    : -1;
  let dateCol = hasHeader ? matchColumn(headers, /date|posted|when/i) : -1;
  let amountCol = hasHeader
    ? matchColumn(headers, /amount|value|total|price|sum/i)
    : -1;
  const categoryCol = hasHeader ? matchColumn(headers, /category|tag/i) : -1;
  const typeCol = hasHeader ? matchColumn(headers, /type|direction|dr\/cr/i) : -1;
  const debitCol = hasHeader
    ? matchColumn(headers, /debit|withdrawal|paid out/i)
    : -1;
  const creditCol = hasHeader
    ? matchColumn(headers, /credit|deposit|paid in/i)
    : -1;

  const used = new Set<number>(
    [categoryCol, typeCol, debitCol, creditCol].filter((c) => c >= 0),
  );

  if (dateCol < 0) dateCol = pickByContent(dataRows, looksDate, used, width);
  if (dateCol >= 0) used.add(dateCol);

  if (amountCol < 0 && debitCol < 0 && creditCol < 0) {
    amountCol = pickByContent(dataRows, looksNumeric, used, width);
  }
  if (amountCol >= 0) used.add(amountCol);

  if (nameCol < 0) {
    nameCol = pickByContent(
      dataRows,
      (v) => !isBlank(v) && !looksNumeric(v) && !looksDate(v),
      used,
      width,
    );
  }

  return dataRows
    .map((row, i): DraftRow | null => {
      const name = nameCol >= 0 ? String(row[nameCol] ?? "").trim() : "";

      let amount = 0;
      let type: TransactionType = "debit";
      if (debitCol >= 0 || creditCol >= 0) {
        const debit = debitCol >= 0 ? toNumber(row[debitCol]) : 0;
        const credit = creditCol >= 0 ? toNumber(row[creditCol]) : 0;
        if (credit > 0 && credit >= debit) {
          amount = credit;
          type = "credit";
        } else {
          amount = debit;
        }
      } else if (amountCol >= 0) {
        amount = Math.abs(toNumber(row[amountCol]));
      }

      if (typeCol >= 0) {
        const t = String(row[typeCol]).toLowerCase();
        if (/credit|deposit|income|refund|cr\b|\bin\b/.test(t)) type = "credit";
        else if (/debit|withdrawal|expense|dr\b|\bout\b/.test(t)) type = "debit";
      }

      if (!name && amount === 0) return null;

      return {
        id: `row-${i}`,
        expense_name: name || "(unnamed)",
        date: dateCol >= 0 ? toISODate(row[dateCol]) : "",
        amount,
        category: categoryCol >= 0 ? normalizeCategory(row[categoryCol]) : "Other",
        type,
      };
    })
    .filter((r): r is DraftRow => r !== null);
}
