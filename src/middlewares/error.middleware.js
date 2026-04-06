const AppError = require("../utils/app-error");

const errorHandler = (error, _request, response, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  if (error.name === "ValidationError") {
    return response.status(400).json({
      success: false,
      message,
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error.name === "CastError") {
    return response.status(400).json({
      success: false,
      message: "Invalid resource identifier",
    });
  }

  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  if (error instanceof AppError || error.isOperational) {
    return response.status(statusCode).json({
      success: false,
      message,
    });
  }

  console.error(error);

  return response.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

module.exports = {
  errorHandler,
};
