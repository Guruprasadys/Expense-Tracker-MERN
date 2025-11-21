import React, { useEffect, useState } from "react";
import { getExpenses } from "../api/api";
import type { Expense } from "../types/api";
import { useNavigate } from "react-router-dom";
import { exportPDF } from "../utils/pdf";

const History = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filter, setFilter] = useState<'all' | 'yesterday' | 'last7' | 'last30'>('all');
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    const fetchExpenses = async () => {
      try {
        const res = await getExpenses(token);
        setExpenses(res.data.expenses || res.data || []);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
      }
    };

    fetchExpenses();
  }, [token, navigate]);

  useEffect(() => {
    const now = new Date();
    const filtered = expenses.filter(exp => {
      const expDate = new Date(exp.date || new Date());
      switch (filter) {
        case "yesterday": {
          const yesterday = new Date();
          yesterday.setDate(now.getDate() - 1);
          return (
            expDate.getFullYear() === yesterday.getFullYear() &&
            expDate.getMonth() === yesterday.getMonth() &&
            expDate.getDate() === yesterday.getDate()
          );
        }
        case "last7": {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          return expDate >= sevenDaysAgo && expDate <= now;
        }
        case "last30": {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          return expDate >= thirtyDaysAgo && expDate <= now;
        }
        case "all":
        default:
          return true;
      }
    });
    setFilteredExpenses(filtered);
  }, [expenses, filter]);

  const filterOptions: Array<'all' | 'yesterday' | 'last7' | 'last30'> = ['all', 'yesterday', 'last7', 'last30'];

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Expense History
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {filterOptions.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full font-semibold transition
                ${filter === f
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow"}`
              }
            >
              {f === "all"
                ? "All"
                : f === "yesterday"
                ? "Yesterday"
                : f === "last7"
                ? "Last 7 Days"
                : "Last 30 Days"}
            </button>
          ))}
        </div>

        {/* Download PDF */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => exportPDF(filteredExpenses)}
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-xl shadow-lg transition font-semibold text-lg"
          >
            Download PDF
          </button>
        </div>

        {/* Expenses Grid */}
        {filteredExpenses.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">No expenses found for this period.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExpenses.map(exp => (
              <div
                key={exp._id}
                className="relative bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition transform hover:-translate-y-2 flex flex-col justify-between"
              >
                {/* Expense Title & Category */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-sm text-gray-500">{exp.category}</p>
                </div>

                {/* Date */}
                <span className="inline-block mb-3 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full shadow-sm">
                  {new Date(exp.date || '').toLocaleDateString()}
                </span>

                {/* Amount */}
                <span className="inline-block px-4 py-2 font-bold text-white bg-gradient-to-r from-green-500 to-teal-600 rounded-xl shadow-md text-lg text-center">
                  ₹{exp.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
