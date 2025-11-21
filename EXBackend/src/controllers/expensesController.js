const Expense = require('../models/Expense');
const { pinFileToPinata } = require('../utils/pinata');

async function getExpenses(req, res) {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
}

async function createExpense(req, res) {
  try {
    const { title, amount, category, date } = req.body;
    if (!title || !amount || !date)
      return res.status(400).json({ error: 'Missing fields' });

    let receiptUrl = null;

    // If receipt uploaded → upload to Pinata
    if (req.file) {
      const pinRes = await pinFileToPinata(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      receiptUrl = `https://gateway.pinata.cloud/ipfs/${pinRes.IpfsHash}`;
    }

    const newExpense = await Expense.create({
      title,
      amount,
      category,
      date,
      receiptUrl,
    });

    res.status(201).json(newExpense);
  } catch (err) {
    console.error('Create expense error:', err);
    res.status(500).json({ error: 'Failed to create expense' });
  }
}

async function deleteExpense(req, res) {
  try {
    const { id } = req.params;
    await Expense.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
}

module.exports = { getExpenses, createExpense, deleteExpense };
