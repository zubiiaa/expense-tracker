"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import '../../styles/theme.css';

const initialNotes = [
  {
    id: 1,
    title: "Shopping List",
    category: "Shopping",
    date: "2024-04-15",
    content: "Need to buy groceries for the week - milk, bread, eggs, fruits 🛒",
  },
  {
    id: 2,
    title: "Budget Goal",
    category: "Goals",
    date: "2024-04-10",
    content: "Save $500 this month for vacation fund! Already saved $200 💪",
  },
];

const categories = ["Personal", "Shopping", "Goals", "Work", "Other"];

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [content, setContent] = useState("");

  // Placeholder add note (not functional yet)
  const handleAddNote = () => {
    // Add note logic here if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 p-6">
      {/* Back to Dashboard */}
      <button
        className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium mb-4"
        onClick={() => router.push("/dashboard")}
      >
        <span className="text-2xl">←</span> Back to Dashboard
      </button>

      {/* Heading */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-display">My Notes</h1>
        <span className="text-3xl">📔💙</span>
      </div>

      {/* Add New Note Card */}
      <div className="bg-pink-100 rounded-2xl shadow-md p-6 mb-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-xl font-semibold text-pink-500 mb-4 font-display">
          <span className="text-2xl">＋</span> Add New Note
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="mb-1 font-bold text-gray-800" htmlFor="note-title">Title</label>
            <input
              id="note-title"
              className="p-3 rounded-xl border-2 border-pink-200 bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder:text-gray-400"
              placeholder="Note title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-bold text-gray-800" htmlFor="note-category">Category</label>
            <select
              id="note-category"
              className="p-3 rounded-xl border-2 border-pink-200 bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-1 font-bold text-gray-800" htmlFor="note-content">Note Content</label>
          <textarea
            id="note-content"
            className="p-3 rounded-xl border-2 border-pink-200 bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-300 w-full min-h-[100px] placeholder:text-gray-400"
            placeholder="Write your note here... ✨"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
        <button
          className="bg-pink-400 hover:bg-pink-500 text-white rounded-xl px-6 py-3 text-lg font-semibold flex items-center gap-2 transition"
          onClick={handleAddNote}
        >
          <span className="text-2xl">＋</span> Add Note
        </button>
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {notes.map(note => (
          <div key={note.id} className="bg-purple-50 rounded-2xl shadow-md p-6 flex flex-col relative">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xl font-semibold text-gray-800 font-display">{note.title}</div>
              <button className="text-pink-400 hover:text-pink-600 text-xl transition" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-purple-200 text-purple-700 rounded-full px-3 py-1 text-xs font-semibold">{note.category}</span>
              <span className="text-xs text-gray-400">{note.date}</span>
            </div>
            <div className="text-gray-700 text-base mb-2">{note.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
