import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import type { Expense } from "../types/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  expenses: Expense[];
}

const ChartComponent: React.FC<Props> = ({ expenses }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-6 text-lg">
        No data available for chart.
      </div>
    );
  }

  // Extract unique categories
  const categories = [...new Set(expenses.map((e) => e.category))];

  // Calculate totals per category
  const totals = categories.map((category) =>
    expenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0)
  );

  // Colors for Pie chart
  const colors = [
    "#6366F1",
    "#EC4899",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#EF4444",
    "#8B5CF6",
    "#F97316",
  ];

  
  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses by Category (₹)",
        data: totals,
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  // Pie chart data
  const pieData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses Distribution",
        data: totals,
        backgroundColor: colors.slice(0, categories.length),
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const, labels: { font: { size: 14 } } },
      title: {
        display: true,
        text: "Expense Distribution",
        font: { size: 20, weight: "bold" as const },
      },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Amount (₹)", font: { size: 14 } },
        ticks: { font: { size: 12 } },
      },
      x: {
        title: { display: true, text: "Categories", font: { size: 14 } },
        ticks: { font: { size: 12 } },
      },
    },
  };

  return (
    <div className="mt-6 grid md:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 md:col-span-1">
        <div className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-3 shadow-md text-center font-semibold">
          Expense Bar Chart
        </div>
        <div className="h-96 md:h-[28rem]">
          <Bar
            data={barData}
            options={{
              ...options,
              maintainAspectRatio: false, // fill container height
            }}
          />
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 md:col-span-1">
        <div className="mb-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl p-3 shadow-md text-center font-semibold">
          Expense Pie Chart
        </div>
        <div className="h-96 md:h-[28rem]">
          <Pie
            data={pieData}
            options={{
              ...options,
              scales: {}, // Pie chart doesn't use x/y scales
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
