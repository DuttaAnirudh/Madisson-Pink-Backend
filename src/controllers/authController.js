const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  // Creating a new user in 'Users' collection
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  const secret = process.env.JWT_SECRET; // JWT Secret
  const expires = process.env.JWT_EXPIRES_IN; // JWT token should expire in 'x' time

  const token = jwt.sign({ id: newUser._id }, secret, { expiresIn: expires });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
