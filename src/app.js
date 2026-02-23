const express = require("express");
const app = express();
const authRouter = require("./router/auth.router");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./middleware/globalErrorHandler");

app.use(cookieParser());

app.use(express.json())

// ** Global error handling middleware
app.use(globalErrorHandler)

app.get("/test", (req, res) => {
  res.json("server is runing");
  console.log("text");
});

app.use("/api/auth", authRouter);
module.exports = app;
