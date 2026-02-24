
const sendResponse = require("../utils/response");

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return sendResponse(res, statusCode, message, null);
};

module.exports = globalErrorHandler;
