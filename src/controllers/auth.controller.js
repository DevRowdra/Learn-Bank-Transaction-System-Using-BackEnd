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
    { expiresIn: "1h" },
  );

  // res.cookie("token", token, )
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });
  return sendResponse(res, 201, "User registered successfully", {
    _id: user._id,
    name: user.name,
    email: user.email,
  });
}

// ** @desc User Login Controller
// ** @route POST /api/v1/auth/login
// ** @access Public

const userLoginController=asyncHandler(async(req,res)=>{
  

})


module.exports = {
  userRegisterController,
};
