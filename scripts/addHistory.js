import Portfolio from "../models/portfolioModel.js";
import Asset from "../models/assetModel.js";

// const calculatePortfolio = async () => {
//   console.log("yo");
//   const portfolios = await Portfolio.find();
//   portfolios.forEach((p) => {
//     const assets = p.assets;
//     const value = assets.reduce(async (acc, ass) => {
//       // if (ass.asset.type === "Cryptocurrency") {
//       const asset = await Asset.findById(ass.asset);
//       acc += ass.sharesAmount * asset.priceInEur;
//       // }
//     }, 0);
//     console.log(value);
//   });
// };
const calculatePortfolio = async () => {
  console.log("yo");
  const portfolios = await Portfolio.find();

  for (const p of portfolios) {
    let value = 0;
    let expense = 0;

    for (const ass of p.assets) {
      const asset = await Asset.findById(ass.asset);
      if (asset.type !== "Cryptocurrency") {
        value += ass.sharesAmount * asset.priceInEur;
        expense += ass.spentInEur;
      }
    }
    // console.log(value, expense);
    const portfolioYield = ((value - expense) / expense) * 100;
    console.log(portfolioYield);
    if (p.history[0]) {
      const annualYield =
        ((value - p.history[0]?.worth - (expense - p.history[0]?.expenses)) /
          p.history[0].worth) *
        100;
      console.log(annualYield);
    }
    const profit = value - expense;
    //Need dividends, profitWithDividends
  }
};

const addHistory = async () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const portfolios = await Portfolio.find();
  portfolios.forEach((p) => {
    if (p.history.length) {
      p.history.forEach((history) => {
        const historyItemDate = history.date;
        const historyItemYear = historyItemDate.getFullYear();
        if (historyItemYear === year) {
          console.log(history);
          //Update history with latest info.
        }
      });
    }
  });
};

export { addHistory, calculatePortfolio };
