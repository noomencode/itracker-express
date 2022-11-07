import express from "express";
import asyncHandler from "express-async-handler";
import Transaction from "../models/transactionModel.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({});
    res.json(transactions);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  })
);

export default router;
