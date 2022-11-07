import mongoose from "mongoose";

const assetInfoSchema = mongoose.Schema(
  {
    ticker: {
      type: String,
      required: true,
    },
    price: {
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
  },
  {
    timestamps: true,
  }
);

const AssetInfo = mongoose.model("AssetInfo", assetInfoSchema);
export default AssetInfo;
