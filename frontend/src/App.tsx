import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import IncomePage from "./pages/Income";   // ✅ IMPORT HERE

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ✅ ADD THIS ROUTE */}
        <Route path="/income" element={<IncomePage />} />

        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}
