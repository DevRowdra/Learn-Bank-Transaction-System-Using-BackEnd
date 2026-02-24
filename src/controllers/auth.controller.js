const { json } = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/response");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

async function userRegisterController(req, res) {
  const { name, email, password } = req.body;
  // 1️⃣ Validate input
  if (!name || !email || !password) {
    throw new AppError("All fields are required", 400);
  }

  const isUserExists = await userModel.findOne({
    email: email,
  });

  if (isUserExists) {
    throw new AppError("User already exists", 422);
  }
  const user = await userModel.create({
    name,
    email,
    password,
  });

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );

  // res.cookie("token", token, )
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });
  return sendResponse(
    res,
    201,
    "User registered successfully",
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  );
}

// ** @desc User Login Controller
// ** @route POST /api/v1/auth/login
// ** @access Public

const userLoginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    throw new AppError("All fields are required to login User", 400);
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new AppError("Invalid Password", 401);
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );

  // res.cookie("token", token, )
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });
  return sendResponse(
    res,
    201,
    "User Login successfully",
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    {token},
  );
  // console.log(isValidPassword);
  // return sendResponse(res, 200, "User login successfully", {
  //   _id: user._id,
  //   name: user.name,
  //   email: user.email,
  // });
});

module.exports = {
  userRegisterController,
  userLoginController,
};
