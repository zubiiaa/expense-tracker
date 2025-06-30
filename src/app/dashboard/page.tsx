"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import '../../styles/theme.css'; // Import theme variables

const months = [
  "January 2024",
  "February 2024",
  "March 2024",
  "April 2024",
];

const pieColors = [
  "var(--color-pie1)",
  "var(--color-pie2)",
  "var(--color-pie3)",
  "var(--color-pie4)",
  "var(--color-pie5)",
];

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState("April 2024");
  const router = useRouter();

  // Placeholder summary data
  const summary = {
    expenses: 3400,
    income: 4000,
    savings: 600,
  };

  // Placeholder categories data
  const categories = [
    { name: "Food", value: 25 },
    { name: "Bills", value: 35 },
    { name: "Entertainment", value: 12 },
    { name: "Transport", value: 9 },
    { name: "Shopping", value: 19 },
  ];

  // Placeholder monthly overview data
  const monthsShort = ["Jan", "Feb", "Mar", "Apr"];
  const barData = [
    { month: "Jan", Income: 4000, Expenses: 3400 },
    { month: "Feb", Income: 4000, Expenses: 2800 },
    { month: "Mar", Income: 4000, Expenses: 3600 },
    { month: "Apr", Income: 4000, Expenses: 3400 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 p-6">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-1 font-display">Financial Management</h1>
          <p className="text-lg text-gray-500">Track your expenses with love <span className="ml-1">💕</span></p>
          </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-md text-lg transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Import Excel
            </button>
            <button 
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-md text-lg transition"
            onClick={() => router.push("/page")}
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 17v1a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h6a3 3 0 013 3v1m5 4h-8m0 0l3-3m-3 3l3 3" /></svg>
            Run API
            </button>
          </div>
        </div>
        
      {/* Month Selector - Custom Styled */}
      <div className="bg-pink-100 rounded-2xl shadow-md p-6 mb-8 max-w-5xl mx-auto">
        <label className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-2 font-display">
          <span className="text-pink-400 text-2xl">📅</span> Select Month
        </label>
        <div className="relative">
          <select
            className="w-full mt-2 p-3 rounded-xl border-2 border-pink-200 bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-300 custom-dropdown"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', fontWeight: 500, color: 'var(--color-dropdown-text)' }}
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-pink-300 text-xl">▼</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-5xl mx-auto">
        <div className="bg-purple-100 rounded-2xl shadow-md p-8 text-center">
          <div className="text-4xl font-extrabold text-purple-600 mb-2">${summary.expenses}</div>
          <div className="text-lg text-gray-500">Total Expenses</div>
        </div>
        <div className="bg-green-100 rounded-2xl shadow-md p-8 text-center">
          <div className="text-4xl font-extrabold text-teal-600 mb-2">${summary.income.toLocaleString()}</div>
          <div className="text-lg text-gray-500">Monthly Income</div>
        </div>
        <div className="bg-pink-100 rounded-2xl shadow-md p-8 text-center">
          <div className="text-4xl font-extrabold text-pink-600 mb-2">${summary.savings}</div>
          <div className="text-lg text-gray-500">Savings</div>
        </div>
                    </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
        {/* Pie Chart */}
        <div className="bg-purple-50 rounded-2xl shadow-md p-6 flex flex-col">
          <div className="text-xl font-semibold mb-4 flex items-center gap-2 font-display text-gray-800">
            Expense Categories <span>🍰</span>
                  </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {categories.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 w-full flex flex-wrap justify-center gap-4">
              {categories.map((cat, idx) => (
                <div key={cat.name} className="flex items-center gap-2 text-sm" style={{ color: pieColors[idx % pieColors.length] }}>
                  <span className="inline-block w-3 h-3 rounded-full" style={{ background: pieColors[idx % pieColors.length] }}></span>
                  {cat.name} {cat.value}%
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Bar Chart */}
        <div className="bg-green-50 rounded-2xl shadow-md p-6 flex flex-col">
          <div className="text-xl font-semibold mb-4 flex items-center gap-2 font-display text-gray-800">
            Monthly Overview <span role="img" aria-label="bar chart">📊</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Income" fill="var(--color-bar-income)" barSize={32} radius={[8, 8, 0, 0]} />
                <Bar dataKey="Expenses" fill="var(--color-bar-expenses)" barSize={32} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        <button
          className="bg-pink-400 hover:bg-pink-500 text-white rounded-2xl p-6 text-lg font-semibold shadow-md flex flex-col items-center transition"
          onClick={() => router.push("/month-detail")}
        >
          <span className="text-2xl mb-2">＋</span>
          Add New Expense
        </button>
        <button
          className="bg-purple-400 hover:bg-purple-500 text-white rounded-2xl p-6 text-lg font-semibold shadow-md flex flex-col items-center transition"
          onClick={() => router.push("/month-overview")}
        >
          <span className="text-2xl mb-2">📅</span>
          Monthly Details
        </button>
        <button
          className="bg-teal-400 hover:bg-teal-500 text-white rounded-2xl p-6 text-lg font-semibold shadow-md flex flex-col items-center transition"
          onClick={() => router.push("/notes")}
        >
          <span className="text-2xl mb-2">♡</span>
          My Notes
        </button>
        <button
          className="bg-orange-400 hover:bg-orange-500 text-white rounded-2xl p-6 text-lg font-semibold shadow-md flex flex-col items-center transition"
          onClick={() => router.push("/debt")}
        >
          <span className="text-2xl mb-2">👥</span>
          Debt Tracker
        </button>
      </div>
    </div>
  );
}
