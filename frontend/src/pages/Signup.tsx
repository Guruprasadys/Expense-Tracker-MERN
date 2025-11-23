import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

interface FormState {
  name: string;
  email: string;
  password: string;
}

interface Message {
  type: "success" | "error";
  text: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/auth/signup`, form);

      // Store ONLY email for login prefill
      localStorage.setItem("signupEmail", form.email);

      setMessage({
        type: "success",
        text: "Signup successful! Redirecting to login...",
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error: unknown) {
      let msg = "Signup failed. Please try again.";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || msg;
      }
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-4">
      {message && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white font-medium shadow-lg z-50 transition-all duration-300 ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md border border-gray-200 hover:shadow-2xl transition duration-300"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Create Account
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition transform ${
            loading
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 hover:shadow-lg hover:scale-105"
          }`}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
