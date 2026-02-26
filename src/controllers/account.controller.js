const accountModel = require("../models/account.model");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/response");

const createAccountController = asyncHandler(async (req, res) => {

const user=req.user;
const account = await accountModel.create({user:user._id});
sendResponse(res, 201, "Account created successfully", account);

})


module.exports = { createAccountController };