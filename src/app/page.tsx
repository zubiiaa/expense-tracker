"use client";

import { useState, useEffect } from "react";

interface Expense {
  _id: string;
  date: string;
  expense_name: string;
  category: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [expenseName, setExpenseName] = useState("Groceries");
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("75.50");
  const [response, setResponse] = useState<any>("Results will appear here...");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Function to add a new expense
  const addExpense = async () => {
    setLoading(true);
    try {
      const expense = {
        expense_name: expenseName,
        category,
        amount: parseFloat(amount),
        date: new Date().toISOString()
      };
      
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense)
      });
      
      const data = await response.json();
      setResponse(data);
      
      // Refresh the expense list after adding
      if (data.success) {
        getExpenses();
      }
    } catch (error) {
      setResponse({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    } finally {
      setLoading(false);
    }
  };
  
  // Function to get all expenses
  const getExpenses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/expenses');
      const data = await response.json();
      setResponse(data);
      
      if (data.success && Array.isArray(data.data)) {
        setExpenses(data.data);
      }
    } catch (error) {
      setResponse({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    } finally {
      setLoading(false);
    }
  };
  
  // Load expenses when component mounts
  useEffect(() => {
    getExpenses();
  }, []);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Expense Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Expense Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
          
          <div className="mb-4">
            <label htmlFor="expense_name" className="block mb-1 font-medium">Expense Name:</label>
            <input 
              type="text" 
              id="expense_name" 
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="category" className="block mb-1 font-medium">Category:</label>
            <input 
              type="text" 
              id="category" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="amount" className="block mb-1 font-medium">Amount:</label>
            <input 
              type="number" 
              id="amount" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              step="0.01"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={addExpense} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
            
            <button 
              onClick={getExpenses} 
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh Expenses'}
            </button>
          </div>
        </div>
        
        {/* Expenses List */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Expenses List</h2>
          
          {expenses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No expenses found. Add your first expense!</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {expenses.map((expense) => (
                <div key={expense._id} className="border-b pb-2 last:border-b-0 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{expense.expense_name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{expense.category}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{formatDate(expense.date)}</p>
                    </div>
                    <span className="font-semibold">${expense.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* API Response */}
      <div className="mt-8 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">API Response:</h3>
        <pre className="text-xs overflow-auto max-h-[200px] p-2 bg-white dark:bg-gray-800 rounded">
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>
    </div>
  );
}
