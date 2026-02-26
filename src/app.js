const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./middleware/globalErrorHandler.middleware.js");

app.use(cookieParser());
app.use(express.json())


// ** Routes
const authRouter = require("./router/auth.router");
const accountRouter = require("./router/account.router");

// * User routes


// ** Global error handling middleware

app.get("/test", (req, res) => {
  res.json("server is runing");
  console.log("text");
});




app.use("/api/v1/accounts",accountRouter);
app.use("/api/v1/auth", authRouter);

app.use(globalErrorHandler)
module.exports = app;
