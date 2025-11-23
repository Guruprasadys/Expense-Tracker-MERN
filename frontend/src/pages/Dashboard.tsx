import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import Chart from "../components/Chart";
import { addExpense, getExpenses, getIncome } from "../api/api";
import type { Expense } from "../types/api";
import { exportPDF } from "../utils/pdf";
import { sendLowBalanceEmail } from "../utils/email"; // ✅ IMPORT ADDED
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      alert("Please login first!");
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch expenses + balance
  const fetchExpenses = async () => {
    if (!token) return;

    try {
      // Fetch expenses
      const res = await getExpenses(token);
      const expData: Expense[] = res.data.expenses || res.data || [];
      setExpenses(expData);

      const totalAmount = expData.reduce((sum, exp) => sum + Number(exp.amount), 0);
      setTotalExpenses(totalAmount);

      // Fetch balance
      const incRes = await getIncome(token);
      const serverBalance = incRes.data?.balance ?? 0;

      // Previous balance (to prevent repeated emails)
      const previousBalance = balance;
      setBalance(serverBalance);

      // Get logged user
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // 🔥 Low balance alert logic (₹2000 threshold)
      if (serverBalance < 2000 && previousBalance >= 2000) {
        if (user.email && user.name) {
          sendLowBalanceEmail(user.email, user.name, serverBalance);
          alert("⚠️ Warning: Your balance is below ₹2000!");
          console.log("Low balance email sent successfully.");
        } else {
          console.log("User info missing, cannot send email.");
        }
      }

    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add new expense
  const handleAdd = async (data: FormData) => {
    if (!token) return;
    await addExpense(data, token);
    fetchExpenses(); // Refresh both totals & balance
  };

  // Delete expense
  const handleDelete = async (id: string) => {
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
    } catch (err) {
      console.error("Failed to delete expense", err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">

      <Navbar
        onLogout={handleLogout}
        onHistory={() => navigate('/history')}
        onIncome={() => navigate('/income')}
      />

      <div className="p-6 max-w-5xl mx-auto space-y-6 mt-8">

        {/* Totals Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 flex justify-between items-center border border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-700">Total Expenses</h2>
              <p className="text-sm text-gray-500">Sum of all expenses</p>
            </div>
            <span className="text-2xl font-semibold text-red-600">₹{totalExpenses}</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 flex justify-between items-center border border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-700">Balance</h2>
              <p className="text-sm text-gray-500">Total Income - Total Expense</p>
            </div>
            <span className="text-2xl font-semibold text-green-600">₹{balance}</span>
          </div>
        </div>

        {/* Download PDF Button */}
        <div className="flex justify-end">
          <button
            onClick={() => exportPDF(expenses)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Download PDF
          </button>
        </div>

        {/* Expense Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <ExpenseForm onAdd={handleAdd} />
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <ExpenseList expenses={expenses} onDelete={handleDelete} />
        </div>

        {/* Expense Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <Chart expenses={expenses} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
