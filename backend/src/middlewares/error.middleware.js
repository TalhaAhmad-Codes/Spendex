const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Database validation failed";
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier";
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = "A resource with this value already exists";
  }

  if (statusCode >= 500) {
    console.error(error);
    message = "Internal server error";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
