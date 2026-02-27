const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./middleware/globalErrorHandler.middleware.js");
const { apiRateLimite } = require("./middleware/rateLimiter.js");


app.use(cookieParser());
app.use(express.json())
// * Apply rate limiting to all requests
app.use(apiRateLimite);

// ** Routes
const authRouter = require("./router/auth.router");
const accountRouter = require("./router/account.router");

// ! test route
app.get("/test", (req, res) => {
  res.send("Welcome to the Bank Transaction System API");
});


// * User routes
app.use("/api/v1/accounts",accountRouter);
app.use("/api/v1/auth", authRouter);

app.use(globalErrorHandler)
module.exports = app;
