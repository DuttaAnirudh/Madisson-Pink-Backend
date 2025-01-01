// const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/errorHandler');
const User = require('../models/User');
const { signToken } = require('../utils/signToken');

exports.signup = catchAsync(async (req, res, next) => {
  // Creating a new user in 'Users' collection
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  // Creating a JWT token
  const token = signToken(newUser._id);

  // Sending response with the token
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

  // 3.) If everything ok, generate a token and send it to the client
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});
