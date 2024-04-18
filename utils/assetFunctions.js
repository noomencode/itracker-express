import yahooFinance from "yahoo-finance2";

const region = (result) => {
  if (
    result.exchange === "TAL" ||
    result.exchange === "LIT" ||
    result.exchange === "LAT"
  ) {
    return "Baltics";
  } else if (
    result.currency === "USD" ||
    result.shortName?.includes("USA") ||
    result.longName?.includes("USA")
  ) {
    return "USA";
  } else {
    return "Europe";
  }
};

const calculatePrices = async (result) => {
  if (result.currency === "SEK") {
    const sek_rate = await yahooFinance.quote("SEKEUR=X");
    result.regularMarketPrice = (
      result.regularMarketPrice * sek_rate.regularMarketPrice
    ).toFixed(2);
    result.regularMarketOpen = (
      result.regularMarketOpen * sek_rate.regularMarketPrice
    ).toFixed(2);
    result.regularMarketPreviousClose = (
      result.regularMarketPreviousClose * sek_rate.regularMarketPrice
    ).toFixed(2);
    result.priceInEur = result.regularMarketPrice;
    result.regularMarketPreviousCloseInEur = result.regularMarketPreviousClose;
  } else if (result.currency === "USD") {
    const usd_rate = await yahooFinance.quote("EUR=X");
    result.priceInEur = (
      result.regularMarketPrice * usd_rate.regularMarketPrice
    ).toFixed(2);
    result.regularMarketPreviousCloseInEur = (
      result.regularMarketPreviousClose * usd_rate.regularMarketPreviousClose
    ).toFixed(2);
  } else if (result.currency === "EUR") {
    result.priceInEur = result.regularMarketPrice;
    result.regularMarketPreviousCloseInEur = result.regularMarketPreviousClose;
  }
  return result;
};

const assetItem = (result) => {
  return {
    price: result.regularMarketPrice,
    priceInEur: result.priceInEur,
    type: result.typeDisp,
    currency: result.currency,
    exchange: result.exchange,
    region: region(result),
    dailyChange: result.regularMarketChangePercent,
    fiftyTwoWeekLow: result.fiftyTwoWeekLow,
    fiftyTwoWeekHigh: result.fiftyTwoWeekHigh,
    priceToBook: result.priceToBook,
    trailingPE: result.trailingPE,
    forwardPE: result.forwardPE,
    bookValue: result.bookValue,
    trailingAnnualDividendYield: result.trailingAnnualDividendYield,
    dividendDate: result.dividendDate,
    averageAnalystRating: result.averageAnalystRating,
    regularMarketOpen: result.regularMarketOpen || null,
    tradeable: result.typeDisp === "Cryptocurrency" ? true : result.tradeable,
    marketState: result.marketState,
    regularMarketPreviousClose: result.regularMarketPreviousClose || null,
    regularMarketPreviousCloseInEur: result.regularMarketPreviousCloseInEur,
    regularMarketTime: result.regularMarketTime,
    marketcap: result.marketcap,
  };
};

export { region, calculatePrices, assetItem };
