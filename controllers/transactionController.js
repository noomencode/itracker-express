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
    user: req.user.id,
    //user: req.session.user_id,
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
  if (req.user.id) {
    const portfolio = await Portfolio.findOne({
      user: req.user.id,
    });
    if (portfolio) {
      const transactions = await Transaction.find({
        portfolio: portfolio.id,
      }).populate("asset");
      res.json(transactions);
    } else {
      res.status(400).json("No transactions found for user.");
    }
  } else {
    res.status(401).json("Not allowed.");
  }
});

// @desc    Delete transaction
// @Route   DELETE /api/transactions
// @access  Private

const deleteTransaction = asyncHandler(async (req, res) => {
  // const { selected } = req.body;
  // selected.forEach(async (t) => {
  //   const transaction = await Transaction.findById(t.id);
  //   if (transaction) {
  //     await transaction.remove();
  //     res.json({ message: "Transaction removed" });
  //   } else {
  //     res.status(404);
  //     throw new Error("Transaction not found");
  //   }
  // });
  const { selected } = req.body;
  const removalPromises = selected.map(async (t) => {
    const transaction = await Transaction.findById(t.id);
    if (transaction) {
      await transaction.remove();
    } else {
      res.status(404);
      throw new Error("Transaction not found");
    }
  });

  try {
    await Promise.all(removalPromises);
    res.json({ message: "Transactions removed" });
  } catch (error) {
    // Handle any errors that occurred during removal
    res.status(500).json({ error: error.message });
  }
});

// @desc    Edit transaction
// @Route   PUT /api/transactions/:id
// @access  Private

const editTransaction = asyncHandler(async (req, res) => {
  const { date, id, type, sharesAmount, price, expense } = req.body;
  const transaction = await Transaction.findById(id);
  transaction.date = date ? date : transaction.date;
  transaction.type = type ? type : transaction.type;
  transaction.amount = sharesAmount ? sharesAmount : transaction.amount;
  transaction.price = price ? price : transaction.price;
  transaction.expense = expense ? expense : transaction.expense;

  transaction.save(function (err) {
    if (err) return console.log(err);
    res.status(204).json(`Transaction updated successfully`);
    console.log(transaction);
  });
});

export { addTransaction, getTransactions, deleteTransaction, editTransaction };
