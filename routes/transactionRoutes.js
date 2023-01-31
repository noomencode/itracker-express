import express from "express";
import {
  addTransaction,
  getTransactions,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getTransactions);
router.route("/").post(protect, addTransaction);

export default router;
