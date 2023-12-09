import mongoose from "mongoose";

const transactionSchema = mongoose.Schema(
  {
    portfolio: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    date: {
      type: Date,
      required: true,
    },
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Asset",
    },
    type: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
    },
    expense: {
      type: Number,
    },
    expenseInEur: {
      type: Number,
    },
    price: {
      type: Number,
    },
    profit: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
