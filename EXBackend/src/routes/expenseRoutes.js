const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { protect } = require("../middleware/authMiddleware");
const Expense = require("../models/Expense");
const Income = require("../models/Income");  // ✅ added
const { pinFileToPinata } = require("../utils/pinata");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * Helper function: calculate balance
 */
async function calculateBalance(userId) {
  const incomes = await Income.find({ user: userId });
  const totalIncome = incomes.reduce((s, i) => s + Number(i.amount || 0), 0);

  const expenses = await Expense.find({ user: userId });
  const totalExpense = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
}

/**
 * GET /api/expenses
 */
router.get("/", protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort("-createdAt");

    const { totalIncome, totalExpense, balance } = await calculateBalance(req.user._id);

    res.status(200).json({
      message: "Expenses fetched successfully",
      expenses,
      totalIncome,
      totalExpense,
      balance,
      lowBalance: balance < 2000, // 🔥 IMPORTANT
    });
  } catch (err) {
    console.error("❌ Error fetching expenses:", err);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

/**
 * POST /api/expenses
 */
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      const pinned = await pinFileToPinata(
        fileBuffer,
        req.file.originalname,
        req.file.mimetype
      );
      imageUrl = `https://gateway.pinata.cloud/ipfs/${pinned.IpfsHash}`;
      fs.unlinkSync(req.file.path);
    }

    await Expense.create({
      user: req.user._id,
      title: req.body.title,
      amount: Number(req.body.amount),
      category: req.body.category,
      date: req.body.date || new Date(),
      imageUrl,
    });

    const expenses = await Expense.find({ user: req.user._id }).sort("-createdAt");

    const { totalIncome, totalExpense, balance } = await calculateBalance(req.user._id);

    res.status(201).json({
      message: "Expense added successfully",
      expenses,
      totalIncome,
      totalExpense,
      balance,
      lowBalance: balance < 2000, // 🔥 IMPORTANT
    });
  } catch (err) {
    console.error("❌ Error adding expense:", err);
    res.status(500).json({ message: "Failed to add expense" });
  }
});

/**
 * DELETE /api/expenses/:id
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Expense not found" });

    const expenses = await Expense.find({ user: req.user._id }).sort("-createdAt");

    const { totalIncome, totalExpense, balance } = await calculateBalance(req.user._id);

    res.status(200).json({
      message: "Expense deleted successfully",
      expenses,
      totalIncome,
      totalExpense,
      balance,
      lowBalance: balance < 2000, // 🔥 IMPORTANT
    });
  } catch (err) {
    console.error("❌ Error deleting expense:", err);
    res.status(500).json({ message: "Failed to delete expense" });
  }
});

module.exports = router;
