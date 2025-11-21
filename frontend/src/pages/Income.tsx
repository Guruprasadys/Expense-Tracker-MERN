import React, { useEffect, useState } from 'react';
import { addIncome, getIncome } from '../api/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const formatDateTime = () => {
  const now = new Date();
  return now.toLocaleString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const backendISODate = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString();
};

const Income: React.FC = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState(formatDateTime());
  const [date, setDate] = useState(backendISODate());

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const rawToken = localStorage.getItem("token");
  const token: string = rawToken ?? "";

  const navigate = useNavigate();

  useEffect(() => {
    if (!rawToken) {
      navigate("/login");
      return;
    }

    const interval = setInterval(() => {
      setCurrentDateTime(formatDateTime());
      setDate(backendISODate());
    }, 1000);

    loadBalance();

    return () => clearInterval(interval);
  }, []);

  const loadBalance = async () => {
    if (!token) return;
    try {
      const res = await getIncome(token);
      setBalance(res.data.balance ?? 0);
    } catch (err) {
      console.error("Failed to load balance", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset any previous error
    setErrorMessage(null);

    if (!title.trim() || !amount.trim()) {
      setErrorMessage("⚠ Please fill in all fields.");
      return;
    }

    try {
      await addIncome({ title, amount: Number(amount), date }, token);
      // successful — clear form and error
      setTitle('');
      setAmount('');
      setErrorMessage(null);
      loadBalance();
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ Failed to add income. Try again later.");
    }
  };

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

      <div className="max-w-xl mx-auto mt-16 p-8 bg-white shadow-2xl rounded-3xl border border-gray-200 relative">

        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>

        <p className="text-center text-xl font-bold mt-3 mb-5 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          📅 {currentDateTime}
        </p>

        <div className="bg-gray-50 p-5 rounded-2xl shadow-inner text-center mb-6 border">
          <p className="text-gray-600 text-sm">Current Balance</p>
          <h2 className="text-4xl font-extrabold text-green-600">₹{balance}</h2>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-xl shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          ⬅ Back to Dashboard
        </button>

        {/* Alert Message */}
        {errorMessage && (
          <div className="mb-4 px-4 py-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="font-semibold text-gray-700">Income Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full mt-1 p-3 border rounded-xl shadow-md transition
                ${errorMessage && !title.trim() ? "border-red-500" : "border-gray-300"}
                focus:ring-2 focus:ring-purple-500`}
              placeholder="Ex: Salary, Freelance, Bonus..."
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full mt-1 p-3 border rounded-xl shadow-md transition
                ${errorMessage && !amount.trim() ? "border-red-500" : "border-gray-300"}
                focus:ring-2 focus:ring-purple-500`}
              placeholder="Enter amount"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-xl shadow-xl hover:scale-[1.03] transition-transform"
          >
            ➕ Add Income
          </button>
        </form>
      </div>
    </div>
  );
};

export default Income;
