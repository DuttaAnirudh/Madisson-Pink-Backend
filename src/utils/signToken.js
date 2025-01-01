const jwt = require('jsonwebtoken');
const AppError = require('./errorHandler');

module.exports = (id, next) => {
  try {
    const secret = process.env.JWT_SECRET; // JWT Secret
    const expires = process.env.JWT_EXPIRES_IN; // JWT token should expire in 'x' time

    return jwt.sign({ id }, secret, { expiresIn: expires });
  } catch (err) {
    next(new AppError('There was an error generating token', 400));
  }
};
