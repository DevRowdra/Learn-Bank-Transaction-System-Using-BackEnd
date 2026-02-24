const express = require("express");
const { userRegisterController, userLoginController } = require("../controllers/auth.controller");

const router = express.Router();


// *post user data and register user *
// route is '/api/auth/register'
router.post('/register',userRegisterController)
router.post('/login',userLoginController)
module.exports = router;

