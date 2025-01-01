const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'a user must have a first name'],
      maxLength: [20, "A name can't have more than 20 charectors"],
    },
    lastName: {
      type: String,
      required: [true, 'a user must have a last name'],
      maxLength: [20, "A name can't have more than 20 charectors"],
    },
    email: {
      type: String,
      required: [true, 'a user must have an email'],
      unique: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: [8, 'A password needs to be atleast 8 charectors long'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'staff', 'admin'],
      default: 'user',
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
            v,
          );
        },
        message: 'Please enter a valid phone number',
      },
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pinCode: String,
    },
    profilePicture: {
      type: String,
      default: 'default.jpg',
      validate: {
        validator: function (v) {
          // Basic image URL validation
          return /\.(jpg|jpeg|png|gif)$/.test(v);
        },
        message: 'Please provide a valid image file',
      },
    },
    twoFactorSecret: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpires: Date,
    lastLogin: Date,
    passwordWasChangedAt: Date,
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  // If the password is not changed(modified), go to next middleware
  // Only run this function if the password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password using bcrypt with cost of 16
  this.password = await bcrypt.hash(this.password, 16);

  next();
});

// METHOD: this method checks if the password enter by the user ir correct.
// It takes in the password entered and compares it with the hashed password
// and returns a boolean
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// METHOD: this methods checks if the password of the user account
// 1. was ever changed or
// 2. was changed before or after the JWT was issued
userSchema.methods.passwordWasChanged = function (JWTtimestamp) {
  if (this.passwordWasChangedAt) {
    // Calculate the time when the password was changed
    const changedTimestemp = parseInt(
      this.passwordWasChangedAt.getTime() / 1000,
      10,
    );

    // return a boolean which tell if the password was changed before or after the JWT was issued
    // The condition below checks if the JWT timestamp is less or more than the time when password was changed
    return JWTtimestamp < changedTimestemp;
  }

  // If passwordChanged does not exist,
  // that means the user has never changed the password
  // so we can return false
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
