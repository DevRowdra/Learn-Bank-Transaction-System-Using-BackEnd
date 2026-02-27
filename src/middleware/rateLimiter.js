const rateLimit = require("express-rate-limit");

// General API limiter
const apiRateLimite = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter (for auth routes)
const authRateLimite = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // only 5 attempts
  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },
});

module.exports = {
  apiRateLimite,
  authRateLimite,
};
