const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/errorHandler');
const User = require('../models/User');

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1.) Get token and check if it exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access.', 401),
    );
  }

  // 2.) Validate(Verification of) the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // jwt.verify uses a callback-based API by default. By promisifying it, we can use async/await syntax instead of callbacks, making the code cleaner and easier to handle errors.

  // 3.) Check if user still exist
  const freshUser = User.findbyId(decoded.id);

  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  // 4.) Check if user changed password after the JWT was issued
  if (freshUser.passwordWasChanged(decoded.iat)) {
    return next(
      new AppError('User recently chnaged password! Please log in again', 401),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser; // add user data to the request body

  // If everything is fine, move on to the next route
  next();
});
