import express from "express";
import connectDB from "./config/db.js";
import assetRoutes from "./routes/assetRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { getQuotes } from "././controllers/assetController.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import session from "express-session";

const MongoStore = require("connect-mongo")(session);

connectDB();

const app = express();
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.get("/", (req, res) => {
  res.send("API RUNNING");
});

app.use("/api/portfolio", portfolioRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

getQuotes();
//setInterval(getQuotes, 600000);
setInterval(getQuotes, 1200000);

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
