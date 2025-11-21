// server.js
require("dotenv").config(); // Load environment variables first

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => res.send("Expense Tracker API running ✅"));

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/expenses", require("./src/routes/expenseRoutes"));
app.use("/api/income", require("./src/routes/incomeRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
