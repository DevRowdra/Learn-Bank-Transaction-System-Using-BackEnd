const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next); // Forward to globalErrorHandler
  };
};

module.exports = asyncHandler;
