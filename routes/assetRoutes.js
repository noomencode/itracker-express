import express from "express";
import {
  getAssets,
  getAssetById,
  addAsset,
  deleteAsset,
} from "../controllers/assetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getAssets);
router.route("/findById/:id").get(getAssetById);

router.route("/").post(addAsset);
router.route("/:id").delete(deleteAsset);

export default router;
