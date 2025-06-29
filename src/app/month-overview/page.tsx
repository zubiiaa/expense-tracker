"use client";

import { useRouter } from "next/navigation";
import '../../styles/theme.css';

const months = [
  {
    name: "January 2024",
    income: 4000,
    expenses: 2800,
    savings: 1200,
    transactions: 45,
    topCategory: { name: "Bills", amount: 1000 },
  },
  {
    name: "February 2024",
    income: 4000,
    expenses: 3200,
    savings: 800,
    transactions: 52,
    topCategory: { name: "Bills", amount: 1150 },
  },
  {
    name: "March 2024",
    income: 4200,
    expenses: 2900,
    savings: 1300,
    transactions: 48,
    topCategory: { name: "Bills", amount: 1120 },
  },
  {
    name: "April 2024",
    income: 4000,
    expenses: 3400,
    savings: 600,
    transactions: 56,
    topCategory: { name: "Bills", amount: 1150 },
  },
];

export default function MonthOverview() {
  const router = useRouter();

  // Helper to go to month-detail with or without add form
  const goToMonthDetail = (showAdd: boolean) => {
    router.push(`/month-detail${showAdd ? '' : '?viewOnly=1'}`);
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
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-display">Monthly Overview</h1>
        <span className="text-3xl">🟦</span>
      </div>

      {/* Monthly Summary Cards - Compact */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 max-w-7xl mx-auto">
        {months.map((month, idx) => (
          <div key={month.name} className="bg-pink-100 rounded-2xl shadow p-4 flex flex-col gap-1 min-w-[220px] max-w-[260px] mx-auto">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-1 font-display">
              <span className="text-xl">📅</span> {month.name}
            </div>
            <div className="flex flex-col gap-0.5 text-sm">
              <div>Income: <span className="font-bold text-green-600">${month.income.toLocaleString()}</span></div>
              <div>Expenses: <span className="font-bold text-pink-500">${month.expenses.toLocaleString()}</span></div>
              <div>Savings: <span className="font-bold text-purple-500">${month.savings.toLocaleString()}</span></div>
              <div>Transactions: <span className="font-bold text-gray-800">{month.transactions}</span></div>
            </div>
            <button
              className="mt-3 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl px-4 py-2 text-base font-semibold flex items-center gap-2 transition justify-center"
              onClick={() => goToMonthDetail(false)}
            >
              <span className="text-lg">👁</span> View Details
            </button>
          </div>
        ))}
      </div>

      {/* Detailed Monthly Breakdown Table - Compact */}
      <div className="bg-purple-50 rounded-2xl shadow-md p-4 mb-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-3 font-display">
          Detailed Monthly Breakdown <span>📊</span>
        </div>
        <table className="w-full text-left text-base">
          <thead>
            <tr className="text-gray-500 text-base">
              <th className="py-2 px-3 font-semibold">Month</th>
              <th className="py-2 px-3 font-semibold">Income</th>
              <th className="py-2 px-3 font-semibold">Expenses</th>
              <th className="py-2 px-3 font-semibold">Savings</th>
              <th className="py-2 px-3 font-semibold">Top Category</th>
              <th className="py-2 px-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {months.map((month, idx) => (
              <tr key={month.name} className="border-b last:border-b-0 hover:bg-purple-100/60 transition">
                <td className="py-2 px-3 text-base text-gray-800">{month.name}</td>
                <td className="py-2 px-3 text-base font-bold text-green-600">${month.income.toLocaleString()}</td>
                <td className="py-2 px-3 text-base font-bold text-pink-500">${month.expenses.toLocaleString()}</td>
                <td className="py-2 px-3 text-base font-bold text-purple-500">${month.savings.toLocaleString()}</td>
                <td className="py-2 px-3">
                  <span className="bg-purple-200 text-purple-700 rounded-full px-3 py-1 text-xs font-semibold">
                    {month.topCategory.name} (${month.topCategory.amount})
                  </span>
                </td>
                <td className="py-2 px-3 flex gap-2">
                  <button
                    className="bg-white border border-pink-200 hover:bg-pink-100 text-gray-800 rounded-2xl px-4 py-1 text-base font-semibold flex items-center gap-2 transition"
                    onClick={() => goToMonthDetail(false)}
                  >
                    <span className="text-lg">👁</span> View
                  </button>
                  <button
                    className="bg-white border border-purple-200 hover:bg-purple-100 text-gray-800 rounded-2xl px-4 py-1 text-base font-semibold flex items-center gap-2 transition"
                    onClick={() => goToMonthDetail(true)}
                  >
                    <span className="text-lg">✏️</span> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
