import express from "express";
import {
  authUser,
  registerUser,
  getUserProfile,
  changePassword,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/changePassword").post(protect, changePassword);
router.route("/profile").get(protect, getUserProfile);
export default router;
