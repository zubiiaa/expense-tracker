"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import '../../styles/theme.css';

const initialOweOthers = [
  { name: "Sarah", amount: 150, detail: "Dinner last week", date: "2024-04-10" },
  { name: "Mom", amount: 200, detail: "Phone bill help", date: "2024-04-05" },
];
const initialOwedMe = [
  { name: "Emma", amount: 75, detail: "Movie tickets", date: "2024-04-12" },
  { name: "Jake", amount: 120, detail: "Uber ride share", date: "2024-04-08" },
];

export default function DebtTracker() {
  const router = useRouter();
  const [tab, setTab] = useState<'oweOthers' | 'owedMe'>('oweOthers');
  const [oweOthers, setOweOthers] = useState(initialOweOthers);
  const [owedMe, setOwedMe] = useState(initialOwedMe);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [detail, setDetail] = useState("");
  const [date, setDate] = useState("");

  const totalOweOthers = oweOthers.reduce((sum, d) => sum + Number(d.amount), 0);
  const totalOwedMe = owedMe.reduce((sum, d) => sum + Number(d.amount), 0);

  // Add new debt record
  const handleAdd = (type: 'oweOthers' | 'owedMe') => {
    if (!name || !amount || !date) return;
    const record = { name, amount: Number(amount), detail, date };
    if (type === 'oweOthers') setOweOthers(prev => [...prev, record]);
    else setOwedMe(prev => [...prev, record]);
    setName(""); setAmount(""); setDetail(""); setDate("");
  };

  // Delete record
  const handleDelete = (type: 'oweOthers' | 'owedMe', idx: number) => {
    if (type === 'oweOthers') setOweOthers(prev => prev.filter((_, i) => i !== idx));
    else setOwedMe(prev => prev.filter((_, i) => i !== idx));
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
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-display">Debt Tracker</h1>
        <span className="text-3xl">💧</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
        <div className="bg-pink-100 rounded-2xl shadow-md p-8 text-center">
          <div className="text-4xl text-pink-400 mb-2">$</div>
          <div className="text-3xl font-extrabold text-pink-500 mb-1">${totalOweOthers}</div>
          <div className="text-lg text-gray-500">I Owe Others</div>
        </div>
        <div className="bg-green-100 rounded-2xl shadow-md p-8 text-center">
          <div className="text-4xl text-teal-500 mb-2">👤</div>
          <div className="text-3xl font-extrabold text-teal-600 mb-1">${totalOwedMe}</div>
          <div className="text-lg text-gray-500">Others Owe Me</div>
        </div>
      </div>

      {/* Add New Debt Record */}
      <div className="bg-purple-50 rounded-2xl shadow-md p-6 mb-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-2xl font-bold text-pink-500 mb-4 font-display">
          <span className="text-2xl">＋</span> Add New Debt Record
        </div>
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4">
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-lg text-gray-800" htmlFor="debt-name">Name</label>
            <input
              id="debt-name"
              className="p-4 rounded-xl border-2 border-pink-200 bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder:text-gray-400"
              placeholder="Person's name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-lg text-gray-800" htmlFor="debt-amount">Amount</label>
            <input
              id="debt-amount"
              type="number"
              className="p-4 rounded-xl border-2 border-pink-200 bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder:text-gray-400"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-lg text-gray-800" htmlFor="debt-detail">Detail</label>
            <input
              id="debt-detail"
              className="p-4 rounded-xl border-2 border-pink-200 bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder:text-gray-400"
              placeholder="What for?"
              value={detail}
              onChange={e => setDetail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-lg text-gray-800" htmlFor="debt-date">Date</label>
            <input
              id="debt-date"
              type="date"
              className="p-4 rounded-xl border-2 border-pink-200 bg-pink-50 text-lg focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder:text-gray-400"
              placeholder="mm/dd/yyyy"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </form>
        <div className="flex gap-4">
          <button
            type="button"
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-8 py-3 text-lg font-semibold flex items-center gap-2 transition"
            onClick={() => handleAdd('oweOthers')}
          >
            I Owe This
          </button>
          <button
            type="button"
            className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-8 py-3 text-lg font-semibold flex items-center gap-2 transition"
            onClick={() => handleAdd('owedMe')}
          >
            They Owe Me
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-4 max-w-6xl mx-auto">
        <button
          className={`flex-1 rounded-full px-4 py-3 font-semibold text-lg transition ${tab === 'oweOthers' ? 'bg-pink-500 text-white' : 'bg-white text-pink-500 border border-pink-200'}`}
          onClick={() => setTab('oweOthers')}
        >
          🤑 I Owe Others
        </button>
        <button
          className={`flex-1 rounded-full px-4 py-3 font-semibold text-lg transition ${tab === 'owedMe' ? 'bg-teal-500 text-white' : 'bg-white text-teal-500 border border-teal-200'}`}
          onClick={() => setTab('owedMe')}
        >
          🪙 Others Owe Me
        </button>
      </div>

      {/* Debt Tables */}
      {tab === 'oweOthers' ? (
        <div className="bg-pink-100 rounded-2xl shadow-md p-6 max-w-6xl mx-auto mb-8">
          <div className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2 font-display">Money I Owe <span>🤑</span></div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-base">
                <th className="py-2 px-3 font-semibold">Name</th>
                <th className="py-2 px-3 font-semibold">Amount</th>
                <th className="py-2 px-3 font-semibold">Detail</th>
                <th className="py-2 px-3 font-semibold">Date</th>
                <th className="py-2 px-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {oweOthers.map((d, idx) => (
                <tr key={idx} className="border-b last:border-b-0 hover:bg-pink-200/60 transition">
                  <td className="py-2 px-3 text-base text-gray-800">{d.name}</td>
                  <td className="py-2 px-3 text-base font-bold text-pink-500">${d.amount}</td>
                  <td className="py-2 px-3 text-base text-gray-800">{d.detail}</td>
                  <td className="py-2 px-3 text-base text-gray-800">{d.date}</td>
                  <td className="py-2 px-3">
                    <button
                      className="text-pink-400 hover:text-pink-600 text-xl transition"
                      title="Delete"
                      onClick={() => handleDelete('oweOthers', idx)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-green-100 rounded-2xl shadow-md p-6 max-w-6xl mx-auto mb-8">
          <div className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2 font-display">Money Owed to Me <span>🪙</span></div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-base">
                <th className="py-2 px-3 font-semibold">Name</th>
                <th className="py-2 px-3 font-semibold">Amount</th>
                <th className="py-2 px-3 font-semibold">Detail</th>
                <th className="py-2 px-3 font-semibold">Date</th>
                <th className="py-2 px-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {owedMe.map((d, idx) => (
                <tr key={idx} className="border-b last:border-b-0 hover:bg-green-200/60 transition">
                  <td className="py-2 px-3 text-base text-gray-800">{d.name}</td>
                  <td className="py-2 px-3 text-base font-bold text-teal-600">${d.amount}</td>
                  <td className="py-2 px-3 text-base text-gray-800">{d.detail}</td>
                  <td className="py-2 px-3 text-base text-gray-800">{d.date}</td>
                  <td className="py-2 px-3">
                    <button
                      className="text-teal-500 hover:text-teal-700 text-xl transition"
                      title="Delete"
                      onClick={() => handleDelete('owedMe', idx)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
