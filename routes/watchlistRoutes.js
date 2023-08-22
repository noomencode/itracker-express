import express from "express";
import {
  createWatchlist,
  addAssetToWatchlist,
  getWatchlist,
  deleteAssetFromWatchlist,
  editWatchlistAsset,
} from "../controllers/watchListController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getWatchlist);
router.route("/").post(protect, createWatchlist);
router.route("/assets").put(protect, addAssetToWatchlist);
router.route("/assets/:id").put(protect, editWatchlistAsset);
router.route("/assets").delete(protect, deleteAssetFromWatchlist);
export default router;
