const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        throw new AppError("Unauthorized, token is missing",401);
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId)
        req.user = user;
        return next();


    }
    catch(err){
        throw new AppError("Unauthorized, invalid token",401);
    }


});
module.exports = {authMiddleware};
