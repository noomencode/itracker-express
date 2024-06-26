import mongoose from "mongoose";

const assetSchema = mongoose.Schema(
  {
    ticker: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    customType: {
      type: String,
    },
    currency: {
      type: String,
    },
    exchange: {
      type: String,
    },
    region: {
      type: String,
    },
    price: {
      type: Number,
    },
    priceInEur: {
      type: Number,
    },
    dailyChange: {
      type: Number,
    },
    fiftyTwoWeekLow: {
      type: Number,
    },
    fiftyTwoWeekHigh: {
      type: Number,
    },
    priceToBook: {
      type: Number,
    },
    trailingPE: {
      type: Number,
    },
    forwardPE: {
      type: Number,
    },
    bookValue: {
      type: Number,
    },
    trailingAnnualDividendYield: {
      type: Number,
    },
    averageAnalystRating: {
      type: String,
    },
    top: {
      type: Boolean,
    },
    tradeable: {
      type: Boolean,
    },
    marketState: {
      type: String,
    },
    regularMarketOpen: {
      type: Number,
    },
    regularMarketPreviousClose: {
      type: Number,
    },
    regularMarketPreviousCloseInEur: {
      type: Number,
    },
    regularMarketTime: {
      type: Date,
    },
    marketcap: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
