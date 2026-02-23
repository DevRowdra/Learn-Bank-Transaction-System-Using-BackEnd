const { json } = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/response");
async function userRegisterController(req, res) {
  try {
    const { name, email, password } = req.body;
    // 1️⃣ Validate input
    if (!name || !email || !password) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: "All fields are required",
      });
      // return  res.status(400).json({
      //   success: false,
      //   message: "All fields are required",
      // });
    }

    const isUserExists = await userModel.findOne({
      email: email,
    });

    if (isUserExists) {
      return res.status(422).json({
        success: false,
        message: "User already exists with this email",
        status: "Failed",
      });
    }
    const user = await userModel({
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
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },

      message: "User registered successfully",
      status: "Success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

module.exports = {
  userRegisterController,
};
