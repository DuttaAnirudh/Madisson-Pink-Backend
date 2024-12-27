class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Adding a stack trace field to the error response object
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
