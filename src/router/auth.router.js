const express = require("express");
const { userRegisterController, userLoginController } = require("../controllers/auth.controller");
const { authRateLimite } = require("../middleware/rateLimiter");

const router = express.Router();


// *post user data and register user *
// route is '/api/auth/register'
router.post('/register',authRateLimite,userRegisterController)
router.post('/login',authRateLimite,userLoginController)
module.exports = router;

