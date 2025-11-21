import React from "react";
import type { Expense } from "../types/api";

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const ExpenseList: React.FC<Props> = ({ expenses, onDelete }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-6 text-lg">
        No expenses added yet.
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2">
      {expenses.map((exp) => (
        <div
          key={exp._id}
          className="relative flex flex-col sm:flex-row justify-between items-center bg-white border border-gray-200 p-5 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            {exp.imageUrl ? (
              <img
                src={exp.imageUrl}
                alt={exp.title}
                className="w-20 h-20 object-cover rounded-xl border border-gray-300 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center rounded-xl bg-gray-100 text-gray-400 font-semibold text-sm border border-gray-200">
                No Image
              </div>
            )}
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{exp.title}</h3>
              <p className="text-sm text-gray-500">{exp.category}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 mt-3 sm:mt-0">
            <span className="px-4 py-2 bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold rounded-xl shadow-md">
              ₹{exp.amount}
            </span>
            <button
              onClick={() => onDelete(exp._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow hover:shadow-lg transition transform hover:scale-105"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
