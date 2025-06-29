"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import '../../styles/theme.css';

const categories = ["Food", "Transport", "Shopping", "Bills", "Other"];

const initialExpenses = [
  { name: "Groceries", date: "2024-04-01", amount: 120, category: "Food" },
  { name: "Coffee", date: "2024-04-02", amount: 15, category: "Food" },
];

export default function MonthDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewOnly = searchParams.get('viewOnly') === '1';
  const [expenseName, setExpenseName] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenses, setExpenses] = useState(initialExpenses);

  // Placeholder summary values
  const openingBalance = 2000;
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const closingBalance = openingBalance - totalExpenses;

  // Add expense (not functional yet)
  const handleAddExpense = () => {
    // Add logic if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 p-6">
      {/* Back to Dashboard */}
      <button
        className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium mb-4 border border-pink-200 rounded-xl px-4 py-2 bg-white shadow-sm"
        onClick={() => router.push("/dashboard")}
      >
        <span className="text-2xl">←</span> Back to Dashboard
      </button>

      {/* Heading */}
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-display">April 2024 Details</h1>
        <span className="text-3xl">🌸</span>
      </div>

      {/* Summary Cards - Compact in viewOnly */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-6xl mx-auto ${viewOnly ? 'p-2' : ''}`}>
        <div className="bg-green-100 rounded-2xl shadow-md p-6 text-center">
          <div className="text-base text-gray-500 mb-1">Opening Balance</div>
          <div className="text-xl font-bold text-gray-800">{openingBalance}</div>
        </div>
        <div className="bg-pink-100 rounded-2xl shadow-md p-6 text-center">
          <div className="text-base text-gray-500 mb-1">Total Expenses</div>
          <div className="text-xl font-bold text-pink-500">${totalExpenses}</div>
        </div>
        <div className="bg-purple-100 rounded-2xl shadow-md p-6 text-center">
          <div className="text-base text-gray-500 mb-1">Closing Balance</div>
          <div className="text-xl font-bold text-gray-800">{closingBalance}</div>
        </div>
      </div>

      {/* Add New Expense Card - Only show if not viewOnly */}
      {!viewOnly && (
        <div className="bg-pink-100 rounded-2xl shadow-md p-6 mb-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-2xl font-bold text-pink-500 mb-4">
            <span className="text-2xl">＋</span> Add New Expense
          </div>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col">
              <label className="mb-2 font-bold text-lg text-gray-800" htmlFor="expense-name">Name</label>
              <input
                id="expense-name"
                className="p-4 rounded-xl border-2 border-pink-200 bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder:text-gray-400"
                placeholder="Expense name"
                value={expenseName}
                onChange={e => setExpenseName(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-bold text-lg text-gray-800" htmlFor="expense-date">Date</label>
              <input
                id="expense-date"
                type="date"
                className="p-4 rounded-xl border-2 border-pink-200 bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder:text-gray-400"
                placeholder="mm/dd/yyyy"
                value={expenseDate}
                onChange={e => setExpenseDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-bold text-lg text-gray-800" htmlFor="expense-amount">Amount</label>
              <input
                id="expense-amount"
                type="number"
                className="p-4 rounded-xl border-2 border-pink-200 bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder:text-gray-400"
                placeholder="0.00"
                value={expenseAmount}
                onChange={e => setExpenseAmount(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-bold text-lg text-gray-800" htmlFor="expense-category">Category</label>
              <select
                id="expense-category"
                className="p-4 rounded-xl border-2 border-pink-200 bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={expenseCategory}
                onChange={e => setExpenseCategory(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl px-12 py-4 text-lg font-semibold flex items-center gap-2 transition mt-6 md:mt-0 h-full"
              onClick={handleAddExpense}
              style={{ minHeight: '56px' }}
            >
              <span className="text-2xl">＋</span> Add
            </button>
          </form>
        </div>
      )}

      {/* Expense List Table - Drag and Drop, Compact in viewOnly */}
      <div className={`bg-purple-50 rounded-2xl shadow-md ${viewOnly ? 'p-4' : 'p-6'} mb-8 max-w-6xl mx-auto`}>
        <div className={`flex items-center gap-2 ${viewOnly ? 'text-xl' : 'text-2xl'} font-bold text-gray-800 mb-4`}>
          Expense List <span>📝</span>
        </div>
        <table className={`w-full text-left ${viewOnly ? 'text-base' : ''}`}>
          <thead>
            <tr className="text-gray-500 text-base">
              <th className="py-2 px-3 font-semibold">Name</th>
              <th className="py-2 px-3 font-semibold">Date</th>
              <th className="py-2 px-3 font-semibold">Amount</th>
              <th className="py-2 px-3 font-semibold">Category</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, idx) => (
              <tr
                key={idx}
                className={`border-b last:border-b-0 hover:bg-purple-100/60 transition ${!viewOnly ? 'cursor-move' : ''}`}
                draggable={!viewOnly}
                onDragStart={e => {
                  if (!viewOnly) e.dataTransfer.setData('text/plain', idx.toString());
                }}
                onDragOver={e => !viewOnly && e.preventDefault()}
                onDrop={e => {
                  if (!viewOnly) {
                    const fromIdx = Number(e.dataTransfer.getData('text/plain'));
                    if (fromIdx === idx) return;
                    const updated = [...expenses];
                    const [moved] = updated.splice(fromIdx, 1);
                    updated.splice(idx, 0, moved);
                    setExpenses(updated);
                  }
                }}
              >
                <td className="py-2 px-3 text-base text-gray-800">{exp.name}</td>
                <td className="py-2 px-3 text-base text-gray-800">{exp.date}</td>
                <td className="py-2 px-3 text-base font-semibold text-pink-500">${exp.amount}</td>
                <td className="py-2 px-3">
                  <span className="bg-purple-200 text-purple-700 rounded-full px-3 py-1 text-xs font-semibold">{exp.category}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Month Details Button */}
      <div className="flex justify-center mb-8">
        <button
          className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-2xl px-10 py-4 text-lg font-semibold flex items-center gap-2 transition shadow-md"
          onClick={() => router.push('/month-overview')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16v2a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-5 4h8m0 0l-3-3m3 3l-3 3" />
          </svg>
          Save Month Details
        </button>
      </div>
    </div>
  );
}
