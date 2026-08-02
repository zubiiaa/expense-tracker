"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Select,
  Textarea,
} from "@/components/ui";
import { formatDate } from "@/lib/format";
import { useCollection } from "@/lib/useCollection";

type Note = {
  _id: string;
  title: string;
  category: string;
  date: string;
  content: string;
};

const CATEGORIES = ["Personal", "Shopping", "Goals", "Work", "Other"];

export default function NotesPage() {
  const { items: notes, loading, add, remove } = useCollection<Note>("/api/notes");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNote = async () => {
    if (!title.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await add({ title: title.trim(), category, content: content.trim() });
      setTitle("");
      setContent("");
      setCategory(CATEGORIES[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add note");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader title="Notes" description="Reminders and financial goals." />

      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Title" htmlFor="n-title">
            <Input
              id="n-title"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>
          <Field label="Category" htmlFor="n-category">
            <Select
              id="n-category"
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
        </div>
        <div className="mt-4">
          <Field label="Content" htmlFor="n-content">
            <Textarea
              id="n-content"
              rows={3}
              placeholder="Write your note…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={addNote} disabled={busy}>
            {busy ? "Adding…" : "Add note"}
          </Button>
          {error ? <span className="text-sm text-negative">{error}</span> : null}
        </div>
      </Card>

      {loading ? (
        <Card className="text-sm text-muted">Loading…</Card>
      ) : notes.length === 0 ? (
        <Card className="text-sm text-muted">No notes yet.</Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {notes.map((note) => (
            <Card key={note._id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium">{note.title}</h3>
                <button
                  onClick={() => remove(note._id)}
                  className="text-muted transition-colors hover:text-negative"
                  aria-label="Delete note"
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
              </div>
              <div className="flex items-center gap-2">
                <Badge>{note.category}</Badge>
                <span className="text-xs text-muted">
                  {formatDate(note.date)}
                </span>
              </div>
              {note.content ? (
                <p className="text-sm text-muted">{note.content}</p>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
