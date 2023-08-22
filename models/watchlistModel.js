import mongoose from "mongoose";

const watchlistSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
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
        customType: {
          type: String,
        },
        asset: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Asset",
        },
        comment: {
          type: String,
        },
        targetPrice: {
          type: Number,
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

export default Watchlist;
