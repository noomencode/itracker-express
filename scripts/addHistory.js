import Portfolio from "../models/portfolioModel.js";
import Asset from "../models/assetModel.js";

const calculatePortfolio = async (portfolio) => {
  const p = portfolio;
  let value = 0;
  let expense = 0;
  let annualYield = 0;
  let portfolioYield = 0;

  for (const ass of p.assets) {
    const asset = await Asset.findById(ass.asset);
    if (asset.type !== "Cryptocurrency") {
      value += ass.sharesAmount * asset.priceInEur;
      expense += ass.spentInEur;
    }
  }
  portfolioYield = ((value - expense) / expense) * 100;
  if (p.history.length) {
    // const lastYearHistory = p.history[p.history.length - 2];
    const currentYear = new Date().getFullYear();
    const lastYearHistory = p.history
      .filter((h) => h.year === currentYear - 1)
      .slice(-1)[0];

    //Annual yield calculation taken from https://taavi.golive.ee/investori-kasiraamat/kuidas-arvutada-tootlust/
    annualYield =
      ((value -
        (lastYearHistory?.worth + (expense - lastYearHistory?.expenses))) /
        (lastYearHistory.worth + (expense - lastYearHistory?.expenses))) *
      100;
    console.log(annualYield);
  }
  const profit = value - expense;

  //Need dividends, profitWithDividends

  return {
    value: value.toFixed(2),
    expense: expense.toFixed(2),
    portfolioYield: portfolioYield.toFixed(2),
    annualYield: annualYield.toFixed(2),
    profit: profit.toFixed(2),
  };
};

const addHistory = async () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  try {
    const portfolios = await Portfolio.find();

    for (const portfolio of portfolios) {
      let monthExists = false;
      const portfolioCalculations = await calculatePortfolio(portfolio);
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

export { addHistory, calculatePortfolio };
