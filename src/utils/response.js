// /**
//  * @typedef {Object} ResponseOptions
//  * @property {boolean} [success]
//  * @property {number} [statusCode]
//  * @property {string} [message]
//  * @property {any} [data]
//  * @property {any} [errors]
//  */

// /**
//  * Send standardized API response
//  * @param {import("express").Response} res
//  * @param {ResponseOptions} options
//  */

const sendResponse = (res, statusCode, message, data = null, meta = {}) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    statusCode,
    message: message || (statusCode < 400 ? "Success" : "Error"),
    data,
    ...meta, // pagination, errors, etc.
  });
};

module.exports = sendResponse;
