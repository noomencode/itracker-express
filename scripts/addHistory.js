import Portfolio from "../models/portfolioModel.js";
import Asset from "../models/assetModel.js";

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
          //Update history with latest info.
        }
      });
    }
  });
};

export { addHistory };
