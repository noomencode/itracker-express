import asyncHandler from "express-async-handler";
import session from "express-session";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  if (!req.session.user_id) {
    res.status(401).json("Not allowed.");
  } else {
    next();
  }
});

export { protect };
