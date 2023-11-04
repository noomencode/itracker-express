import express from "express";
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  editTransaction,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getTransactions);
router.route("/").post(protect, addTransaction);
router.route("/:id").put(protect, editTransaction);
router.route("/").delete(protect, deleteTransaction);

export default router;
