const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/errorHandler');
const User = require('../models/User');

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

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1.) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2.) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3.) If everything ok, send the token to the client
  const secret = process.env.JWT_SECRET; // JWT Secret
  const expires = process.env.JWT_EXPIRES_IN; // JWT token should expire in 'x' time

  const token = jwt.sign({ id: user._id }, secret, { expiresIn: expires });

  res.status(200).json({
    status: 'success',
    token,
  });
});
