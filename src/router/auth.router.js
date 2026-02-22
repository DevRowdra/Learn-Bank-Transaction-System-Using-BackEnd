const express = require("express");
const { userRegisterController } = require("../controllers/auth.controller");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json("server is runing");
  console.log("text");
});
// *post user data and register user *
// route is '/api/auth/register'
router.post('/register',userRegisterController)
module.exports = router;
