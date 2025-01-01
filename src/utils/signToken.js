const jwt = require('jsonwebtoken');

exports.signToken = (id) => {
  const secret = process.env.JWT_SECRET; // JWT Secret
  const expires = process.env.JWT_EXPIRES_IN; // JWT token should expire in 'x' time

  return jwt.sign({ id }, secret, { expiresIn: expires });
};
