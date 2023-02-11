import asyncHandler from "express-async-handler";
import Asset from "../models/assetModel.js";
import yahooFinance from "yahoo-finance2";

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

  const asset = await Asset.create({
    ticker,
    name,
  });

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

//// @desc  Get quotes for assets
// @Route   Currently not a API route
// @access  Private

const getQuotes = async () => {
  const assets = await Asset.find({});

  assets.map(async (asset) => {
    try {
      const result = await yahooFinance.quote(asset.ticker);

      if (result.currency === "SEK") {
        const sek_rate = await yahooFinance.quote("SEKEUR=X");
        result.regularMarketPrice = (
          result.regularMarketPrice * sek_rate.regularMarketPrice
        ).toFixed(2);
      }
      const region = (result) => {
        if (
          result.exchange === "TAL" ||
          result.exchange === "LIT" ||
          result.exchange === "LAT"
        ) {
          return "Baltics";
        } else if (result.currency === "USD") {
          return "USA";
        } else {
          return "Europe";
        }
      };
      const updatedItem = await Asset.findOneAndUpdate(
        { ticker: asset.ticker },
        {
          price: result.regularMarketPrice,
          type: result.typeDisp,
          currency: result.currency,
          exchange: result.exchange,
          region: region(result),
          dailyChange: result.regularMarketChangePercent.toFixed(2),
          fiftyTwoWeekLow: result.fiftyTwoWeekLow,
          fiftyTwoWeekHigh: result.fiftyTwoWeekHigh,
          priceToBook: result.priceToBook,
          trailingPE: result.trailingPE,
          forwardPE: result.forwardPE,
          bookValue: result.bookValue,
          trailingAnnualDividendYield: result.trailingAnnualDividendYield,
          dividendDate: result.dividendDate,
          averageAnalystRating: result.averageAnalystRating,
        }
      );
      if (updatedItem) {
        console.log(
          `${asset.ticker} updated! New price ${result.regularMarketPrice}, type: ${result.exchange}`
        );
      } else {
        console.log("Invalid asset data");
      }
    } catch (error) {
      console.warn(
        `Skipping yf.quote("${asset.ticker}"): [${error.name}] ${error.message}`
      );
      return;
    }
  });
};

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
    //console.log(resultArray);
    //console.log(resultFiltered[0].shortname);
    res.json(resultArray);
  } else {
    res.status(501);
    throw new Error("Search did not give any results");
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
};
