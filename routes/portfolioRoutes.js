import express from "express";
import {
  createPortfolio,
  addAssetToPortfolio,
  getPortfolio,
  deleteAssetFromPortfolio,
  editPortfolioAsset,
} from "../controllers/portfolioController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getPortfolio);
router.route("/").post(createPortfolio);
router.route("/assets").put(protect, addAssetToPortfolio);
router.route("/assets/:id").put(protect, editPortfolioAsset);
router.route("/assets").delete(protect, deleteAssetFromPortfolio);
export default router;
