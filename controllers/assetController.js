import asyncHandler from "express-async-handler";
import Asset from "../models/assetModel.js";
import yahooFinance from "yahoo-finance2";
import { region, calculatePrices, assetItem } from "../utils/assetFunctions.js";

// @desc    Fetch all assets
// @Route   GET /api/assets
// @access  Private

const getAssets = asyncHandler(async (req, res) => {
  const assets = await Asset.find({});
  res.json(assets);
});

// @desc    Fetch top assets
// @Route   GET /api/assets/top
// @access  Public

const getTopAssets = asyncHandler(async (req, res) => {
  const assets = await Asset.find({ top: true });
  res.json(assets);
});

// @desc    Fetch single asset
// @Route   GET /api/assets/findById/:id
// @access  Private

const getAssetById = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if (asset) {
    res.json(asset);
  } else {
    res.status(404);
    throw new Error("Asset not found");
  }
});

// @desc    Create single asset
// @Route   POST /api/assets
// @access  Private

const addAsset = asyncHandler(async (req, res) => {
  const { name, ticker } = req.body;

  const assetExists = await Asset.findOne({
    ticker,
  });

  if (assetExists) {
    //res.status(303);
    return res.json(assetExists);
  }

  const quote = await yahooFinance.quote(ticker);
  const updatedQuotes = await calculatePrices(quote);
  const newAsset = assetItem(updatedQuotes);
  newAsset.ticker = ticker;
  newAsset.name = name;
  // const asset = await Asset.create({
  //   ticker,
  //   name,
  // });

  const asset = await Asset.create(newAsset);
  if (asset) {
    res.status(201);
    return res.json(asset);
  } else {
    res.status(400);
    throw new Error("Invalid asset data");
  }
});

//// @desc  Delete asset
// @Route   DELETE /api/assets/findById/:id
// @access  Private

const deleteAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if (asset) {
    await asset.remove();
    res.json({ message: "Asset removed" });
  } else {
    res.status(404);
    throw new Error("Asset not found");
  }
});

//// @desc  Get quote for asset
// @Route   GET /api/assets/quote/:ticker
// @access  Public

const getSingleQuote = asyncHandler(async (req, res) => {
  const quote = await yahooFinance.quote(req.params.ticker);
  if (quote) {
    res.json(quote);
  } else {
    res.status(404);
  }
});

//// @desc  Get quotes for assets
// @Route   Currently not a API route
// @access  Private

// const getQuotes = asyncHandler(async (req, res) => {
//   const assets = await Asset.find({});

//   assets.map(async (asset) => {
//     try {
//       const result = await yahooFinance.quote(asset.ticker);
//       //Add price in EUR for USD and SEK assets.
//       const updatedResult = await calculatePrices(result);

//       const updatedItem = await Asset.findOneAndUpdate(
//         { ticker: asset.ticker },
//         assetItem(updatedResult)
//       );
//       if (updatedItem) {
//         console.log(
//           `${asset.ticker} updated! New price: ${result.regularMarketPrice}, previous day price: ${result.regularMarketPreviousClose}`
//         );
//       } else {
//         console.log("Invalid asset data");
//       }
//     } catch (error) {
//       console.warn(
//         `Skipping yf.quote("${asset.ticker}"): [${error.name}] ${error.message}`
//       );
//       res.status(503);
//       return;
//     }
//   });
// });

const getQuotes = asyncHandler(async (req, res) => {
  try {
    const assets = await Asset.find({});
    const promises = assets.map(async (asset) => {
      try {
        const result = await yahooFinance.quote(asset.ticker);
        const updatedResult = await calculatePrices(result);

        const updatedItem = await Asset.findOneAndUpdate(
          { ticker: asset.ticker },
          assetItem(updatedResult)
        );
        if (updatedItem) {
          console.log(
            `${asset.ticker} updated! New price: ${result.regularMarketPrice}, previous day price: ${result.regularMarketPreviousClose}`
          );
        } else {
          console.log("Invalid asset data");
        }
      } catch (error) {
        console.warn(
          `Skipping yf.quote("${asset.ticker}"): [${error.name}] ${error.message}`
        );
      }
    });

    await Promise.all(promises);
    res.status(200).json({ message: "Quotes updated successfully" });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    res.status(503).json({ error: "Failed to update quotes" });
  }
});

//// @desc  Search for asset
// @Route   /api/assets/search
// @access  Public

const searchAssets = asyncHandler(async (req, res) => {
  const { query } = req.body;
  const result = await yahooFinance.search(query);
  if (result) {
    const resultFiltered = result.quotes.filter(
      (x) => x.isYahooFinance === true
    );
    const resultArray = resultFiltered.map((res, index) => {
      return { key: index, ...res };
    });
    res.json(resultArray);
  } else {
    res.status(501);
    throw new Error("Search did not give any results");
  }
});

//// @desc  Get currency rates
// @Route   /api/assets/currency/:ticker
// @access  Public

const getCurrencyRate = asyncHandler(async (req, res) => {
  const asset = await Asset.findOne({ ticker: req.params.ticker });
  if (asset) {
    res.json(asset);
  } else {
    res.status(404);
    throw new Error("Asset not found");
  }
});

export {
  getAssets,
  getTopAssets,
  getAssetById,
  addAsset,
  deleteAsset,
  searchAssets,
  getQuotes,
  getSingleQuote,
  getCurrencyRate,
};
