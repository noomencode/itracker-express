import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import assetRoutes from "./routes/assetRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { getQuotes } from "././controllers/assetController.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import yahooFinance from "yahoo-finance2";

dotenv.config();

connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      httpOnly: true,
    },
  })
);
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

// app.get("/", (req, res) => {
//   res.send("API RUNNING");
// });

app.use("/api/portfolio", portfolioRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

getQuotes();
setInterval(getQuotes, 300000);
