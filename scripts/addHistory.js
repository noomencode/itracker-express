import Portfolio from "../models/portfolioModel.js";
import Asset from "../models/assetModel.js";
import Transaction from "../models/transactionModel.js";

const calculateCurrentPortfolio = async (portfolio) => {
  const p = portfolio;

  let value = 0;
  let valueWithCrypto = 0;
  let valuePreviousClose = 0;
  let expense = 0;
  let expenseWithCrypto = 0;
  let annualYield = 0;
  // let annualYieldWithCrypto = 0;
  let portfolioYield = 0;

  const currentYear = new Date().getFullYear();

  for (const ass of p.assets) {
    const asset = await Asset.findById(ass.asset);
    let prevPrice;
    if (asset.type !== "Cryptocurrency") {
      // console.log(ass.name + " " + ass.spentInEur);
      value += ass.sharesAmount * asset.priceInEur;
      expense += ass.spentInEur;
      //Previous day value calc
      const currentDate = new Date().toISOString().slice(0, 10); // Extract YYYY-MM-DD part
      if (asset.marketState !== "REGULAR") {
        if (asset.regularMarketTime.toISOString().slice(0, 10) < currentDate) {
          //If market is CLOSED and the last timestamp is not from today, then give regular price.
          prevPrice = asset.priceInEur;
        } else {
          //If market is CLOSED and the last timestamp is from today, then give previous close price.
          prevPrice = asset.regularMarketPreviousCloseInEur;
        }
      } else {
        prevPrice = asset.regularMarketPreviousCloseInEur;
      }
      valuePreviousClose += ass.sharesAmount * prevPrice;
    }

    valueWithCrypto += ass.sharesAmount * asset.priceInEur;
    expenseWithCrypto += ass.spentInEur;
  }
  portfolioYield = ((value - expense) / expense) * 100;
  console.log(valuePreviousClose);
  //Need dividends, profitWithDividends
  const transactions = await Transaction.find({ portfolio: p.id });
  const dividends = transactions.filter((t) => t.type === "Dividend");
  const dividendsReceived = dividends.reduce(
    (acc, div) => {
      if (div.date.getFullYear() === currentYear) {
        acc.thisYear += div.profit;
      }
      acc.total += div.profit;
      return acc;
    },
    { total: 0, thisYear: 0 }
  );
  if (p.history.length) {
    // const lastYearHistory = p.history[p.history.length - 2];

    const lastYearHistory = p.history
      .filter((h) => h.year === currentYear - 1)
      .slice(-1)[0];

    //Annual yield calculation taken from https://taavi.golive.ee/investori-kasiraamat/kuidas-arvutada-tootlust/
    annualYield =
      ((value -
        (lastYearHistory?.worth +
          (expense - lastYearHistory?.expenses) -
          dividendsReceived.thisYear)) /
        (lastYearHistory.worth +
          (expense - lastYearHistory?.expenses) -
          dividendsReceived.thisYear)) *
      100;
  }
  const profit = value - expense;

  return {
    value: value.toFixed(2),
    valueWithCrypto: valueWithCrypto.toFixed(2),
    valuePreviousClose: valuePreviousClose,
    expense: expense.toFixed(2),
    expenseWithCrypto: expenseWithCrypto.toFixed(2),
    portfolioYield: portfolioYield.toFixed(2),
    annualYield: annualYield.toFixed(2),
    profit: profit.toFixed(2),
    dividends: dividendsReceived.total.toFixed(2),
    dividendsThisYear: dividendsReceived.thisYear.toFixed(2),
  };
};

const runCalculationsAndUpdatePortfolio = async () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  try {
    const portfolios = await Portfolio.find();

    for (const portfolio of portfolios) {
      let monthExists = false;
      const portfolioCalculations = await calculateCurrentPortfolio(portfolio);
      //Add portfolio totals
      portfolio.performance.value = portfolioCalculations.value;
      portfolio.performance.expenses = portfolioCalculations.expense;
      portfolio.performance.dividends = portfolioCalculations.dividends;
      portfolio.performance.valueWithCrypto =
        portfolioCalculations.valueWithCrypto;
      portfolio.performance.expensesWithCrypto =
        portfolioCalculations.expenseWithCrypto;
      portfolio.performance.valuePreviousClose =
        portfolioCalculations.valuePreviousClose;
      if (portfolio.history.length) {
        for (const history of portfolio.history) {
          const historyItemDate = new Date(history.date);
          const historyItemYear = historyItemDate.getFullYear();
          const historyItemMonth = historyItemDate.getMonth();

          if (historyItemYear === year && historyItemMonth === month) {
            monthExists = true;
            // Update history with the latest info
            history.date = currentDate;
            history.worth = portfolioCalculations.value;
            history.expenses = portfolioCalculations.expense;
            history.yield = portfolioCalculations.portfolioYield;
            history.annualYield = portfolioCalculations.annualYield;
            history.profit = portfolioCalculations.profit;
            history.dividends = portfolioCalculations.dividendsThisYear;
          }
        }
        if (!monthExists) {
          const newHistoryItem = {
            date: currentDate,
            year: year,
            worth: portfolioCalculations.value,
            expenses: portfolioCalculations.expense,
            yield: portfolioCalculations.portfolioYield,
            annualYield: portfolioCalculations.annualYield,
            profit: portfolioCalculations.profit,
          };
          portfolio.history.push(newHistoryItem);
        }
        // Save the changes to the portfolio document
        await portfolio.save();
      }
    }
  } catch (error) {
    console.error(error);
    // Handle errors here
  }
};

export { runCalculationsAndUpdatePortfolio, calculateCurrentPortfolio };
