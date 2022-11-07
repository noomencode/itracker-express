import mongoose from "mongoose";

const transactionSchema = mongoose.Schema(
  {
    account_id: {
      required: true,
      type: Number,
    },
    transaction_count: {
      type: Number,
    },
    bucket_start_date: {
      type: Date,
    },
    bucket_end_date: {
      type: Date,
    },
    transactions: [
      {
        date: {
          required: true,
          type: Date,
        },
        amount: {
          required: true,
          type: Number,
        },
        transaction_code: {
          required: true,
          type: String,
        },
        price: {
          required: true,
          type: String,
        },
        total: {
          required: true,
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
