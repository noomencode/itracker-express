import asyncHandler from "express-async-handler";
//import session from "express-session";
import Asset from "../models/assetModel.js";
import Transaction from "../models/transactionModel.js";
import Portfolio from "../models/portfolioModel.js";

// @desc    Add new transaction
// @Route   PUT /api/transactions
// @access  Private

const addTransaction = asyncHandler(async (req, res) => {
  const { ticker, date, type, amount, price, expense } = req.body;
  const asset = await Asset.findOne({ ticker: ticker });
  const portfolio = await Portfolio.findOne({
    //user: user,
    user: req.session.user_id,
  });
  if (asset && portfolio) {
    const transaction = await Transaction.create({
      portfolio: portfolio.id,
      date: date,
      asset: asset.id,
      type: type,
      amount: amount,
      price: price,
      expense: expense,
    });
    if (transaction) {
      portfolio.transactions.push({ transaction: transaction.id });
      portfolio.save(() => {
        res.status(201);
        res.send("Transaction successfully added to portfolio.");
        console.log(transaction);
      });
    } else {
      res.status(400);
      res.send("Something went wrong. Transaction not added to portfolio.");
    }
  } else {
    res.status(400);
    res.send("Asset or portfolio not found.");
  }
});

// @desc    Get portfolio transactions
// @Route   GET /api/transactions
// @access  Private

const getTransactions = asyncHandler(async (req, res) => {
  if (req.session.user_id) {
    const portfolio = await Portfolio.find({
      user: req.session.user_id,
    }).populate("transactions.transaction");
    if (portfolio[0].transactions.length) {
      res.json(portfolio.transactions);
    } else {
      res.status(400).json("No transactions found for user.");
    }
  } else {
    res.status(401).json("Not allowed.");
  }
});

export { addTransaction, getTransactions };
