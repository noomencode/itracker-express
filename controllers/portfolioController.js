import asyncHandler from "express-async-handler";
import session from "express-session";
import Asset from "../models/assetModel.js";
import Portfolio from "../models/portfolioModel.js";

// @desc    Get current user's portfolio
// @Route   GET /api/portfolio
// @access  Private

const getPortfolio = asyncHandler(async (req, res) => {
  if (req.user.id) {
    //if (req.session.user_id) {
    const portfolio = await Portfolio.find({
      //user: req.session.user_id,
      user: req.user.id,
    }).populate("assets.asset");
    if (portfolio[0].assets.length) {
      res.json(portfolio);
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

// @desc    Add asset to portfolio
// @Route   PUT /api/portfolio/assets
// @access  Private

const addAssetToPortfolio = asyncHandler(async (req, res) => {
  const { ticker, name, sharesAmount, spent } = req.body;
  const tickerExists = await Portfolio.findOne({
    //user: req.session.user_id,
    user: req.user.id,
    assets: { ticker: ticker },
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
    console.log(portfolio);
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
  const portfolio = await Portfolio.findOne({ user: req.session.user_id });
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
// @Route   DELETE /api/portfolio/assets/:id
// @access  Private

const editPortfolioAsset = asyncHandler(async (req, res) => {
  const { name, spent, sharesAmount, id } = req.body;
  const portfolio = await Portfolio.findOne({ user: req.user.id });
  //const portfolio = await Portfolio.findOne({ user: req.session.user_id });
  const asset = await portfolio.assets.id(req.params.id);
  asset.name = name;
  asset.spent = spent;
  asset.sharesAmount = sharesAmount;
  //asset.save();
  portfolio.save(function (err) {
    if (err) return console.log(err);
    res.status(204).json(`Asset updated successfully`);
    console.log(asset);
  });
});

export {
  createPortfolio,
  addAssetToPortfolio,
  getPortfolio,
  deleteAssetFromPortfolio,
  editPortfolioAsset,
};
