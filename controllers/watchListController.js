import asyncHandler from "express-async-handler";
import Asset from "../models/assetModel.js";
import Watchlist from "../models/watchListModel.js";
// @desc    Get current user's watchlist
// @Route   GET /api/watchlist
// @access  Private

const getWatchlist = asyncHandler(async (req, res) => {
  if (req.user.id) {
    const watchlist = await Watchlist.find({
      user: req.user.id,
    }).populate("assets.asset");
    if (watchlist) {
      if (watchlist[0].assets.length) {
        res.json(watchlist);
      } else {
        res.status(400).json("No assets found in watchlist for user.");
      }
    } else {
      res.status(400).json("No watchlist found for user.");
    }
  } else {
    res.status(401).json("Not allowed.");
  }
});

// @desc    Create watchlist for user
// @Route   POST /api/watchlist
// @access  Private

const createWatchlist = asyncHandler(async (req, res) => {
  const watchlistExists = await Watchlist.findOne({
    user: req.user.id,
  });

  if (watchlistExists) {
    res.status(400);
    throw new Error("Watchlist already exists.");
  }

  const watchlist = await Watchlist.create({
    user: req.user.id,
  });

  if (watchlist) {
    res.status(201);
    res.send(`Watchlist created!`);
  } else {
    res.status(400);
    throw new Error("Invalid watchlist data");
  }
});

// @desc    Add asset to portfolio
// @Route   PUT /api/portfolio/assets
// @access  Private

const addAssetToWatchlist = asyncHandler(async (req, res) => {
  const { ticker, name, customType, comment, targetPrice } = req.body;
  const tickerExists = await Watchlist.findOne({
    user: req.user.id,
    assets: { ticker: ticker },
  });
  if (tickerExists) {
    return res.status(400).json("Asset already in watchlist");
  }
  const asset = await Asset.findOne({ ticker: ticker });
  const assetId = asset.id;
  const newAsset = {
    ticker: ticker,
    name: name,
    customType: customType,
    asset: assetId,
    comment: comment,
    targetPrice: targetPrice,
  };

  const watchlist = await Watchlist.findOneAndUpdate(
    { user: req.user.id },
    {
      $push: {
        assets: newAsset,
      },
    }
  );
  if (watchlist) {
    res.status(201);
    res.send(`Asset added to watchlist!`);
  } else {
    res.status(400);
    throw new Error("Invalid watchlist data");
  }
});

// @desc    Delete asset from portfolio
// @Route   DELETE /api/portfolio/assets
// @access  Private

const deleteAssetFromWatchlist = asyncHandler(async (req, res) => {
  const { selected } = req.body;
  const watchlist = await Watchlist.findOne({ user: req.user.id });
  selected.forEach(async (a) => {
    const asset = await watchlist.assets.id(a.id);
    await asset.remove();
  });
  watchlist.save(function (err) {
    if (err) return console.log(err);
    res.status(204).json(`Asset(s) deleted successfully from watchlist.`);
  });
});

// @desc    Edit asset in portfolio
// @Route   PUT /api/portfolio/assets/:id
// @access  Private

const editWatchlistAsset = asyncHandler(async (req, res) => {
  const { name, customType, comment } = req.body;
  const watchlist = await Watchlist.findOne({ user: req.user.id });
  const asset = await watchlist.assets.id(req.params.id);
  asset.name = name ? name : asset.name;
  asset.customType = customType ? customType : asset.customType;
  asset.comment = comment ? comment : asset.comment;

  watchlist.save(function (err) {
    if (err) return console.log(err);
    res.status(204).json(`Asset updated successfully`);
    console.log(asset);
  });
});

export {
  createWatchlist,
  addAssetToWatchlist,
  getWatchlist,
  deleteAssetFromWatchlist,
  editWatchlistAsset,
};
