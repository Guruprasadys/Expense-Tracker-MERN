const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    title: String,
    amount: Number,
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);
