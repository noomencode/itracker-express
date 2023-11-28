import express from "express";
import {
  getAssets,
  getTopAssets,
  getAssetById,
  addAsset,
  deleteAsset,
  searchAssets,
  getCurrencyRate,
  getSingleQuote,
  getQuotes,
} from "../controllers/assetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAssets);
router.route("/getQuotes").get(getQuotes);
router.route("/top").get(getTopAssets);
router.route("/findById/:id").get(getAssetById);
router.route("/currency/:ticker").get(getCurrencyRate);
router.route("/quote/:ticker").get(getSingleQuote);
router.route("/search").post(searchAssets);
router.route("/").post(protect, addAsset);
router.route("/:id").delete(protect, deleteAsset);

export default router;
