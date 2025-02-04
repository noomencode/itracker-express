import express from "express";
import {
  createPortfolio,
  addAssetToPortfolio,
  getPortfolio,
  deleteAssetFromPortfolio,
  editPortfolioAsset,
  addPerformanceHistory,
  addPortfolioGoals,
  editPortfolioGoals,
} from "../controllers/portfolioController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getPortfolio);
router.route("/").post(createPortfolio);
router.route("/").put(protect, addPerformanceHistory);
router.route("/assets").put(protect, addAssetToPortfolio);
router.route("/assets/:id").put(protect, editPortfolioAsset);
router.route("/assets").delete(protect, deleteAssetFromPortfolio);
router.route("/goals").post(protect, addPortfolioGoals);
router.route("/goals").put(protect, editPortfolioGoals);

export default router;
