import React from 'react';

interface NavbarProps {
  onLogout: () => void;
  onHistory: () => void;
  onIncome: () => void; // NEW
}

const Navbar: React.FC<NavbarProps> = ({ onLogout, onHistory, onIncome }) => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="font-bold text-xl md:text-2xl tracking-wide">Expense Tracker</h1>
      <div className="space-x-3">
        <button
          onClick={onIncome}
          className="bg-green-400 hover:bg-green-500 text-gray-800 font-medium px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105"
        >
          Income
        </button>

        <button
          onClick={onHistory}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105"
        >
          History
        </button>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
