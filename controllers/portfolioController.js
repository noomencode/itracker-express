import asyncHandler from "express-async-handler";
import session from "express-session";
import Asset from "../models/assetModel.js";
import Portfolio from "../models/portfolioModel.js";

// @desc    Get current user's portfolio
// @Route   GET /api/portfolio
// @access  Private

const getPortfolio = asyncHandler(async (req, res) => {
  if (req.user.id) {
    const portfolio = await Portfolio.find({
      user: req.user.id,
    }).populate("assets.asset");
    if (portfolio) {
      if (portfolio[0].assets.length) {
        res.json(portfolio);
      } else {
        res.status(400).json("No assets found for user.");
      }
    } else {
      res.status(400).json("No portfolio found for user.");
    }
  } else {
    res.status(401).json("Not allowed.");
  }
});

// @desc    Create portfolio for user
// @Route   POST /api/portfolio
// @access  Private

const createPortfolio = asyncHandler(async (req, res) => {
  const { user } = req.body;

  const portfolioExists = await Portfolio.findOne({
    user,
  });

  if (portfolioExists) {
    res.status(400);
    throw new Error("Portfolio already exists.");
  }

  const portfolio = await Portfolio.create({
    user,
  });

  if (portfolio) {
    res.status(201);
    res.send(`Portfolio created!`);
  } else {
    res.status(400);
    throw new Error("Invalid portfolio data");
  }
});

// @desc    Add historic values about portfolio performance
// @Route   PUT /api/portfolio
// @access  Private

const addPerformanceHistory = asyncHandler(async (req, res) => {
  const { date, worth, expenses, portfolioYield, dividends, realProfit } =
    req.body;
  const portfolio = await Portfolio.findOne({ user: req.user.id });
  const history = {
    date: date,
    worth: worth,
    expenses: expenses,
    yield: portfolioYield,
    dividends: dividends,
    profit: profit,
    profitWithDividends: profitWithDividends,
    yieldWithDividends: yieldWithDividends,
  };
  portfolio.history.push(history);
  portfolio.save(function (err) {
    if (err) return console.log(err);
    res.status(204).json(`Performance history added to portfolio.`);
    console.log(portfolio);
  });
});

// @desc    Add asset to portfolio
// @Route   PUT /api/portfolio/assets
// @access  Private

const addAssetToPortfolio = asyncHandler(async (req, res) => {
  const { ticker, name, sharesAmount, spent, spentInEur, customType } =
    req.body;
  const tickerExists = await Portfolio.findOne({
    user: req.user.id,
    assets: { $elemMatch: { ticker: ticker } },
  });

  if (tickerExists) {
    return res.status(400).json("Asset already in portfolio");
  }
  const asset = await Asset.findOne({ ticker: ticker });
  const assetId = asset.id;
  const newAsset = {
    ticker: ticker,
    name: name,
    sharesAmount: sharesAmount,
    spent: spent,
    spentInEur: spentInEur,
    customType: customType,
    asset: assetId,
  };

  const portfolio = await Portfolio.findOneAndUpdate(
    //{ user: req.session.user_id },
    { user: req.user.id },
    {
      $push: {
        assets: newAsset,
      },
    }
  );
  if (portfolio) {
    res.status(201);
    res.send(`Asset added to portfolio!`);
  } else {
    res.status(400);
    throw new Error("Invalid portfolio data");
  }
});

// @desc    Delete asset from portfolio
// @Route   DELETE /api/portfolio/assets
// @access  Private

const deleteAssetFromPortfolio = asyncHandler(async (req, res) => {
  const { selected } = req.body;
  const portfolio = await Portfolio.findOne({ user: req.user.id });
  selected.forEach(async (a) => {
    const asset = await portfolio.assets.id(a.id);
    await asset.remove();
  });
  portfolio.save(function (err) {
    if (err) return console.log(err);
    res.status(204).json(`Asset(s) deleted successfully from portfolio.`);
  });
});

// @desc    Edit asset in portfolio
// @Route   PUT /api/portfolio/assets/:id
// @access  Private

const editPortfolioAsset = asyncHandler(async (req, res) => {
  const { name, spent, spentInEur, sharesAmount, customType, profit } =
    req.body;
  let newProfit = parseFloat(profit);
  const portfolio = await Portfolio.findOne({ user: req.user.id });
  const asset = await portfolio.assets.id(req.params.id);
  if (asset.profit > 0 && newProfit > 0) {
    newProfit = newProfit + asset.profit;
  }
  asset.name = name ? name : asset.name;
  asset.spent = spent ? spent : asset.spent;
  asset.spentInEur = spentInEur ? spentInEur : asset.spentInEur;
  asset.sharesAmount = sharesAmount ? sharesAmount : asset.sharesAmount;
  asset.customType = customType ? customType : asset.customType;
  asset.profit = newProfit ? newProfit : asset.profit;

  portfolio.save(function (err) {
    if (err) return console.log(err);
    res.status(204).json(`Asset updated successfully`);
    console.log(asset);
  });
});

export {
  createPortfolio,
  addPerformanceHistory,
  addAssetToPortfolio,
  getPortfolio,
  deleteAssetFromPortfolio,
  editPortfolioAsset,
};
