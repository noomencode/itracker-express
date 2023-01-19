import express from "express";
import { addTransaction } from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addTransaction);

export default router;
