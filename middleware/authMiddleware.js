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

// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select("-password");
//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(401);
//       throw new Error("Not authorized, token failed");
//     }
//   }

//   if (!token) {
//     res.status(401);
//     throw new Error("Not authorized, no token");
//   }
// });

export { protect };
