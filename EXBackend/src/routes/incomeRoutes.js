const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Income = require("../models/Income");
const Expense = require("../models/Expense");

const router = express.Router();

/**
 * ✅ GET /api/income
 * Fetch all income for logged-in user + total balance (income - expenses)
 */
router.get("/", protect, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id }).sort("-createdAt");
    const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0);

    const expenses = await Expense.find({ user: req.user._id });
    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    res.status(200).json({
      message: "Income fetched successfully",
      incomes,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (err) {
    console.error("❌ Error fetching income:", err);
    res.status(500).json({ message: "Failed to fetch income" });
  }
});

/**
 * ✅ POST /api/income
 * Add an income entry
 */
router.post("/", protect, async (req, res) => {
  try {
    const income = await Income.create({
      user: req.user._id,
      title: req.body.title,
      amount: Number(req.body.amount),
      date: req.body.date || new Date(),
    });

    const incomes = await Income.find({ user: req.user._id }).sort("-createdAt");
    const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0);

    const expenses = await Expense.find({ user: req.user._id });
    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    res.status(201).json({
      message: "Income added successfully",
      income,
      incomes,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (err) {
    console.error("❌ Error adding income:", err);
    res.status(500).json({ message: "Failed to add income" });
  }
});

/**
 * ✅ DELETE /api/income/:id
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Income.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Income not found" });

    const incomes = await Income.find({ user: req.user._id }).sort("-createdAt");
    const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0);

    const expenses = await Expense.find({ user: req.user._id });
    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    res.status(200).json({
      message: "Income deleted successfully",
      incomes,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (err) {
    console.error("❌ Error deleting income:", err);
    res.status(500).json({ message: "Failed to delete income" });
  }
});

module.exports = router;
