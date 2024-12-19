const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A Booking must be connected to a user'],
    },
    rooms: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
        required: [true, 'A Booking must be connected to at least one room'],
      },
    ],
    checkInDate: {
      type: Date,
      required: [true, 'A booking must have a check-in date'],
      validate: {
        validator: function (value) {
          return value >= new Date();
        },
        message: 'Check-in date cannot be in the past',
      },
    },
    checkOutDate: {
      type: Date,
      required: [true, 'A booking must have a check-out date'],
      validate: {
        validator: function (value) {
          return value > this.checkInDate;
        },
        message: 'Check-out date must be after check-in date',
      },
    },
    totalGuests: {
      type: Number,
      required: [
        true,
        'A booking must specify the total number of guests checking in',
      ],
    },
    totalPrice: {
      type: Number,
      required: [true, 'A booking must have total price'],
    },
    specialRequests: {
      type: String,
      max: [100, "Special request can't have more than 100 charectors"],
    },
    status: {
      type: String,
      required: [true, 'A booking must have a status'],
      enum: ['checked_in', 'checked_out', 'reserved', 'cancelled', 'no_show'],
      default: 'reserved',
    },
    paymentStatus: {
      type: String,
      required: [true, 'A booking must have a payment status'],
      enum: ['paid', 'failed', 'not_paid'],
    },
    paymentReference: {
      type: String,
      unique: true,
    },
    numberOfNights: {
      type: Number,
      required: [
        true,
        'A booking must mention the total number of nights the guest will be staying',
      ],
    },
    ratePerNight: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    discountApplied: {
      type: Number,
      default: 0,
    },
    additionalServices: [String],
    guestDetails: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: String,
      specialPreferences: String,
      idType: {
        type: String,
        enum: ['passport', 'drivers_license', 'national_id'],
      },
      idNumber: String,
    },
    cancellation: {
      isCancelled: {
        type: Boolean,
        default: false,
      },
      cancellationDate: Date,
      cancellationReason: String,
      refundAmount: Number,
      cancelledBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    },
  },
  { timestamps: true },
);

// Add Pre-save Hook for numberOfNights
bookingSchema.pre('save', function (next) {
  if (this.checkInDate && this.checkOutDate) {
    const oneDay = 24 * 60 * 60 * 1000;
    this.numberOfNights = Math.round(
      Math.abs((this.checkOutDate - this.checkInDate) / oneDay),
    );
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
