import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import assetRoutes from "./routes/assetRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import { getQuotes } from "././controllers/assetController.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { updateAsset } from "./scripts/updateItems.js";
import { addHistory, calculatePortfolio } from "./scripts/addHistory.js";

dotenv.config();

connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
app.use(express.json());

app.enable("trust proxy");

app.use(
  cors({
    credentials: true,
    origin:
      process.env.NODE_ENV === "production"
        ? "https://investenzo.onrender.com"
        : "http://localhost:3000",
  })
);

app.use("/api/portfolio", portfolioRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

// getQuotes();
addHistory();
// setInterval(getQuotes, 300000);
