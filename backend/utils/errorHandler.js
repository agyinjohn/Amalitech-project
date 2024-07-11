// utils/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace for debugging

  const statusCode = err.statusCode || 500; // Set the status code, default to 500 if not provided
  const message = err.message || "Internal Server Error"; // Set the error message, default to a generic message if not provided

  res.status(statusCode).json({
    success: false,
    message,
    // Optionally include stack trace only in development mode
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
