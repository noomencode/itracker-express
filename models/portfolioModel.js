import mongoose from "mongoose";

const portfolioSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    history: [
      {
        date: {
          type: Date,
          required: true,
        },
        worth: {
          type: Number,
          required: true,
        },
        expenses: {
          type: Number,
          required: true,
        },
        yield: {
          type: Number,
        },
        annualYield: {
          type: Number,
        },
        dividends: {
          type: Number,
        },
        profit: {
          type: Number,
        },
        profitWithDividends: {
          type: Number,
        },
        yieldWithDividends: {
          type: Number,
        },
      },
    ],
    assets: [
      {
        name: {
          type: String,
          required: true,
        },
        ticker: {
          type: String,
          required: true,
        },
        sharesAmount: {
          type: Number,
          required: true,
        },
        spent: {
          type: Number,
        },
        spentInEur: {
          type: Number,
        },
        customType: {
          type: String,
        },
        asset: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Asset",
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    transactions: [
      {
        transaction: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Transaction",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
