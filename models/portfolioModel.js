import mongoose from "mongoose";

const portfolioSchema = mongoose.Schema(
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
        sharesAmount: {
          type: Number,
          required: true,
        },
        spent: {
          type: Number,
        },
        asset: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Asset",
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
