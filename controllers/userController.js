import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Auth user & get token
// @Route   POST /api/users/login
// @access  Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
  });

  if (user && (await user.matchPassword(password))) {
    //generateToken(res, user._id);
    res.json({
      //_id: user._id,
      name: user.name,
      isAuthenticated: true,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register new user
// @Route   POST /api/users
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({
    email,
  });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    //req.session.user_id = user._id;
    //await generateToken(res, user._id);
    res.status(201).json({
      name: user.name,
      isAuthenticated: true,
      token: generateToken(user._id),
      _id: user._id,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Change password
// @Route   POST /api/users/changePassword
// @access  Private

const changePassword = asyncHandler(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  const user = await User.findOne({
    email,
  });

  if (user && (await user.matchPassword(oldPassword))) {
    user.password = newPassword;
    user.save();
  }
});

// @desc    Get user profile
// @Route   POST /api/users/profile
// @access  Private

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { authUser, registerUser, getUserProfile };
