import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  const token = req.cookies.token || "";
  try {
    if (!token) {
      return res.status(401).json("You need to Login");
    }
    const decrypt = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decrypt.id,
      firstname: decrypt.firstname,
    };
    next();
  } catch (err) {
    return res.status(500).json(err.toString());
  }
};

// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   if (
//     req.cookies.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select("-password");
//       next();
//     } catch (error) {
//       console.log(error);
//       res.status(401);
//       throw new Error("Not authorized.");
//     }
//   }
//   if (!token) {
//     res.status(401);
//     throw new Error("Not authorized, no token.");
//   }
// });

// SESSION AUTH
// const protect = asyncHandler(async (req, res, next) => {
//   if (!req.session.user_id) {
//     res.status(401).json("Not allowed.");
//   } else {
//     next();
//   }
// });

export { protect };
