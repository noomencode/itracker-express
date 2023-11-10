import Portfolio from "../models/portfolioModel.js";
import Asset from "../models/assetModel.js";

// const updateAsset = async () => {
//   try {
//     const portfolio = await Portfolio.findOne({
//       user: "63231e9b89bd82258657dae9",
//     });
//     const assets = portfolio.assets;
//     for (const a of assets) {
//       const asset = await Asset.findById(a.asset);

//       if (asset.currency === "EUR" || asset.currency === "SEK") {
//         // Assuming you want to update the 'ass' object here
//         const ass = portfolio.assets.id(a._id);
//         // Perform your updates on 'ass' here if needed
//         // For example, you can set ass.currency = 'NewCurrency'
//         ass.spentInEur = ass.spent;
//         // Save the updated portfolio
//         await portfolio.save(function (err) {
//           if (err) return console.log(err);
//           console.log(ass);
//         });
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }

//   //   const intelId = intel._id;
//   //   const ass = await portfolio.assets.id(intelId);
//   //   ass.spentInEur = 20.0;
//   //   portfolio.save(function (err) {
//   //     if (err) return console.log(err);
//   //     console.log(ass);
//   //   });
// };

const updateAsset = async () => {
  try {
    const portfolio = await Portfolio.findOne({
      user: "63231e9b89bd82258657dae9",
    });
    const assets = portfolio.assets;

    // Create an array to hold the updated assets
    const updatedAssets = [];

    for (const a of assets) {
      const asset = await Asset.findById(a.asset);
      if (!a.spentInEur) {
        console.log(a.name);
        // if (asset.ticker === "CRM") {
        //   const ass = portfolio.assets.id(a._id);
        //   ass.spentInEur = 618.8;
        //   updatedAssets.push(ass);
        // }
      }
      // if (asset.currency === "EUR" || asset.currency === "SEK") {
      //   const ass = portfolio.assets.id(a._id);
      //   // Perform your updates on 'ass' here if needed
      //   // For example, you can set ass.spentInEur = ass.spent;
      //   ass.spentInEur = ass.spent;
      //   updatedAssets.push(ass);
      // }
      // if (asset.currency === "USD") {
      //   if (asset.ticker === "INTC") {
      //     const ass = portfolio.assets.id(a._id);
      //     ass.spentInEur = 19.4;
      //   }
      // }
    }

    //Save the updated assets back to the portfolio
    updatedAssets.forEach((ass) => {
      ass.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log(ass);
        }
      });
    });

    // Save the updated portfolio
    await portfolio.save();
  } catch (error) {
    console.error(error);
  }
};

export { updateAsset };
